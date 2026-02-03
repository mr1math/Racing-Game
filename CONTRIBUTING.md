
## 2. ملفات اللعبة الأساسية

### ملف `index.html`
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لعبة السيارات - Racing Game</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="loading-screen">
        <div class="loader">
            <i class="fas fa-car"></i>
            <p>جاري تحميل اللعبة...</p>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        </div>
    </div>

    <div id="game-container">
        <canvas id="game-canvas"></canvas>
        
        <!-- واجهة المستخدم -->
        <div id="hud">
            <div class="speedometer">
                <span class="speed">0</span>
                <span class="unit">كم/س</span>
            </div>
            <div class="lap-counter">
                <span class="current-lap">1</span>/<span class="total-laps">3</span>
            </div>
            <div class="timer">00:00:00</div>
        </div>

        <div id="menu" class="hidden">
            <h1><i class="fas fa-flag-checkered"></i> لعبة السيارات</h1>
            <button id="start-game" class="menu-btn">
                <i class="fas fa-play"></i> بدء اللعبة
            </button>
            <button id="select-car" class="menu-btn">
                <i class="fas fa-car"></i> اختيار السيارة
            </button>
            <button id="select-track" class="menu-btn">
                <i class="fas fa-road"></i> اختيار المسار
            </button>
            <button id="settings" class="menu-btn">
                <i class="fas fa-cog"></i> الإعدادات
            </button>
        </div>
    </div>

    <script src="dist/main.js"></script>
</body>
</html>
