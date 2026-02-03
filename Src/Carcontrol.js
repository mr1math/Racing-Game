import * as THREE from 'three';

export class CarController {
    constructor(carMesh) {
        this.car = carMesh;
        this.speed = 0;
        this.maxSpeed = 100;
        this.acceleration = 50;
        this.deceleration = 30;
        this.brakePower = 60;
        this.turnSpeed = 1.5;
        
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.direction = new THREE.Vector3(0, 0, 1);
        
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            brake: false
        };
    }

    handleKeyDown(event) {
        switch(event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                this.keys.forward = true;
                break;
            case 'arrowdown':
            case 's':
                this.keys.backward = true;
                break;
            case 'arrowleft':
            case 'a':
                this.keys.left = true;
                break;
            case 'arrowright':
            case 'd':
                this.keys.right = true;
                break;
            case ' ':
                this.keys.brake = true;
                break;
        }
    }

    handleKeyUp(event) {
        switch(event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                this.keys.forward = false;
                break;
            case 'arrowdown':
            case 's':
                this.keys.backward = false;
                break;
            case 'arrowleft':
            case 'a':
                this.keys.left = false;
                break;
            case 'arrowright':
            case 'd':
                this.keys.right = true;
                break;
            case ' ':
                this.keys.brake = false;
                break;
        }
    }

    update(deltaTime) {
        // التحكم في التسارع
        if (this.keys.forward) {
            this.speed += this.acceleration * deltaTime;
        } else if (this.keys.backward) {
            this.speed -= this.acceleration * deltaTime;
        } else if (this.keys.brake) {
            // الكبح
            if (this.speed > 0) {
                this.speed -= this.brakePower * deltaTime;
                if (this.speed < 0) this.speed = 0;
            } else if (this.speed < 0) {
                this.speed += this.brakePower * deltaTime;
                if (this.speed > 0) this.speed = 0;
            }
        } else {
            // التباطؤ الطبيعي
            if (this.speed > 0) {
                this.speed -= this.deceleration * deltaTime;
                if (this.speed < 0) this.speed = 0;
            } else if (this.speed < 0) {
                this.speed += this.deceleration * deltaTime;
                if (this.speed > 0) this.speed = 0;
            }
        }
        
        // الحد من السرعة القصوى
        this.speed = THREE.MathUtils.clamp(this.speed, -this.maxSpeed / 2, this.maxSpeed);
        
        // التحكم في الدوران
        let turnAngle = 0;
        if (this.keys.left) {
            turnAngle = this.turnSpeed * deltaTime;
        }
        if (this.keys.right) {
            turnAngle = -this.turnSpeed * deltaTime;
        }
        
        // تطبيق الدوران على السرعة
        if (Math.abs(this.speed) > 0.1) {
            this.car.rotation.y += turnAngle * (this.speed / this.maxSpeed);
        }
        
        // تحديث الاتجاه
        this.direction.set(
            Math.sin(this.car.rotation.y),
            0,
            Math.cos(this.car.rotation.y)
        );
        
        // حساب الحركة
        this.velocity.copy(this.direction).multiplyScalar(this.speed * deltaTime);
        this.car.position.add(this.velocity);
        
        // التأكد من بقاء السيارة على الأرض
        this.car.position.y = 1;
    }

    getSpeed() {
        return Math.abs(this.speed);
    }

    getPosition() {
        return this.car.position.clone();
    }

    getRotation() {
        return this.car.quaternion.clone();
    }
}
