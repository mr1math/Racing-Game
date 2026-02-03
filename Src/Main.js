import * as THREE from 'three';
import { CarController } from './scripts/cars/CarController.js';
import { GameManager } from './scripts/core/GameManager.js';
import { HUD } from './scripts/ui/HUD.js';

class RacingGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.car = null;
        this.gameManager = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        // إنشاء المشهد
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        
        // إنشاء الكاميرا
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 10, 20);
        
        // إنشاء المُصيِّر
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // إضافة الإضاءة
        this.setupLighting();
        
        // إضافة الأرض
        this.createGround();
        
        // تهيئة مدير اللعبة
        this.gameManager = new GameManager(this);
        
        // تهيئة واجهة المستخدم
        this.hud = new HUD();
        
        // إنشاء السيارة
        this.createCar();
        
        // بدء الحلقة الرئيسية
        this.animate();
        
        // إضافة مستمعي الأحداث
        this.setupEventListeners();
        
        // إخفاء شاشة التحميل
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
            }, 500);
        }, 2000);
    }

    setupLighting() {
        // إضاءة موجهة
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
        
        // إضاءة محيطة
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: 0x3a7c3a,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // إضافة خطوط الطريق
        this.createRoad();
    }

    createRoad() {
        const roadGeometry = new THREE.PlaneGeometry(20, 200);
        const roadMaterial = new THREE.MeshLambertMaterial({
            color: 0x444444
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = Math.PI / 2;
        road.position.y = 0.1;
        road.receiveShadow = true;
        this.scene.add(road);
        
        // إضافة خطوط الطريق
        for (let i = -100; i < 100; i += 10) {
            const lineGeometry = new THREE.PlaneGeometry(1, 5);
            const lineMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = Math.PI / 2;
            line.position.set(0, 0.2, i);
            this.scene.add(line);
        }
    }

    createCar() {
        // إنشاء نموذج سيارة بسيط
        const carGroup = new THREE.Group();
        
        // هيكل السيارة
        const bodyGeometry = new THREE.BoxGeometry(3, 1, 6);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        carGroup.add(body);
        
        // الكابينة
        const cabinGeometry = new THREE.BoxGeometry(2, 1, 2);
        const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.y = 0.5;
        cabin.position.z = -1;
        cabin.castShadow = true;
        carGroup.add(cabin);
        
        // العجلات
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            
            const x = i < 2 ? -1.2 : 1.2;
            const z = i % 2 === 0 ? -2 : 2;
            wheel.position.set(x, -0.5, z);
            carGroup.add(wheel);
        }
        
        carGroup.position.set(0, 1, 0);
        this.scene.add(carGroup);
        
        // إنشاء متحكم السيارة
        this.car = new CarController(carGroup);
    }

    setupEventListeners() {
        // مستمعي النافذة
        window.addEventListener('resize', () => this.onWindowResize());
        
        // مستمعي لوحة المفاتيح
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // مستمعي الأزرار
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeyDown(event) {
        if (this.car) {
            this.car.handleKeyDown(event);
        }
    }

    onKeyUp(event) {
        if (this.car) {
            this.car.handleKeyUp(event);
        }
    }

    startGame() {
        document.getElementById('menu').classList.add('hidden');
        this.gameManager.startRace();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // تحديث السيارة
        if (this.car) {
            this.car.update(deltaTime);
            
            // تحديث الكاميرا لتبع السيارة
            this.updateCamera();
            
            // تحديث واجهة المستخدم
            this.hud.updateSpeed(this.car.getSpeed());
        }
        
        // تحديث مدير اللعبة
        if (this.gameManager) {
            this.gameManager.update(deltaTime);
        }
        
        // تصيير المشهد
        this.renderer.render(this.scene, this.camera);
    }

    updateCamera() {
        const carPosition = this.car.getPosition();
        const offset = new THREE.Vector3(0, 10, -20);
        offset.applyQuaternion(this.car.getRotation());
        
        this.camera.position.copy(carPosition).add(offset);
        this.camera.lookAt(carPosition);
    }
}

// بدء اللعبة عند تحميل الصفحة
window.addEventListener('load', () => {
    new RacingGame();
});
