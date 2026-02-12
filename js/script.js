// js/script.js (fully rewritten with requestAnimationFrame, dt-based physics, smooth key controls, falling animation, real-time timer/score)
let ctx;
let canvas;
let actionForce = 0;
let counterForce = 0;
let ballPosition = 300;
let ballY = 220;
let velocityX = 0;
let velocityY = 0;
let score = 0;
let startTime = 0;
let lastTime = 0;
let animationId;
let levelInterval;
let isGameRunning = false;
let isFalling = false;
let leftPressed = false;
let rightPressed = false;
let level = 1;
const canvasWidth = 600;
const canvasHeight = 400;
const centerX = canvasWidth / 2;
const platformLeft = 120;
const platformRight = 480;
const mass = 1;
const accelScale = 60; // pixels per sec^2 per N (tune for feel)
const gravity = 800; // pixels per sec^2
const drag = 0.99;
const changeSpeed = 100; // N per sec hold key
const pointsPerSec = 25;
const balanceThreshold = 4;

function startGame() {
    if (isGameRunning) {
        endGame();
    }
    isGameRunning = true;
    isFalling = false;
    level = 1;
    actionForce = getRandomForce();
    counterForce = 0;
    ballPosition = centerX;
    ballY = 220;
    velocityX = 0;
    velocityY = 0;
    score = 0;
    startTime = performance.now();
    lastTime = startTime;
    document.getElementById('counterValue').textContent = counterForce;
    document.getElementById('gameResult').innerHTML = '';
    document.getElementById('score').innerHTML = `Score: 0`;
    document.getElementById('timer').innerHTML = `Time: 0s`;
    document.getElementById('startButton').textContent = 'Reset Game';
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    gameLoop();
    levelInterval = setInterval(() => {
        if (isGameRunning) {
            level++;
            actionForce = getRandomForce();
            velocityX *= 0.5;
        }
    }, 10000);
}

function getRandomForce() {
    const maxForce = 40 + level * 10;
    return Math.floor(Math.random() * (2 * maxForce + 1)) - maxForce;
}

function gameLoop(currentTime = performance.now()) {
    if (!isGameRunning) return;
    const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap dt for stability
    lastTime = currentTime;

    const netForce = actionForce + counterForce;
    
    // Keyboard input (smooth hold)
    if (!isFalling) {
        if (leftPressed) {
            counterForce = Math.max(-120, counterForce - changeSpeed * dt);
        }
        if (rightPressed) {
            counterForce = Math.min(120, counterForce + changeSpeed * dt);
        }
    }
    document.getElementById('counterValue').textContent = Math.round(counterForce);

    // Physics
    if (!isFalling) {
        // Horizontal physics on platform
        velocityX += netForce * accelScale * dt / mass;
        velocityX *= drag;
        ballPosition += velocityX * dt;
        
        // Check if off platform
        if (ballPosition < platformLeft || ballPosition > platformRight) {
            isFalling = true;
            velocityY = -50 * dt * 60; // small upward kick for realism
        }
    } else {
        // Falling physics
        velocityX *= drag;
        velocityY += gravity * dt;
        ballPosition += velocityX * dt;
        ballY += velocityY * dt;
        
        // Game over if hit ground
        if (ballY > canvasHeight) {
            endGame();
            return;
        }
    }

    // Update timer and score (real-time, accurate)
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('timer').innerHTML = `Time: ${elapsed}s`;
    if (Math.abs(netForce) < balanceThreshold) {
        score += pointsPerSec * dt;
    }
    document.getElementById('score').innerHTML = `Score: ${Math.floor(score)}`;

    drawGame(netForce);
    animationId = requestAnimationFrame(gameLoop);
}

function drawGame(netForce) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Platform
    ctx.fillStyle = '#555';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.fillRect(platformLeft, 235, platformRight - platformLeft, 25);
    ctx.shadowBlur = 0;
    
    // Ball with shadow
    ctx.fillStyle = '#ff4444';
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.arc(ballPosition, ballY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Force arrows (from center)
    const scale = 1.8;
    drawArrow(centerX, 70, actionForce, '#007bff', 'Action');
    drawArrow(centerX, 95, counterForce, '#ff8800', 'Counter');
    const netColor = Math.abs(netForce) < balanceThreshold ? '#00ff88' : '#ff4400';
    drawArrow(centerX, 120, netForce, netColor, 'Net');
    
    // Labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`Action: ${actionForce} N`, 20, 55);
    ctx.fillText(`Counter: ${Math.round(counterForce)} N`, 20, 80);
    ctx.fillText(`Net: ${Math.round(netForce)} N`, 20, 105);
    
    ctx.font = 'bold 20px Arial';
    if (isFalling) {
        ctx.fillStyle = '#ff0000';
        ctx.fillText('UNBALANCED! Ball falling off!', 120, 280);
    } else {
        ctx.fillStyle = '#333';
        ctx.fillText('Keep balanced to stay on platform!', 100, 280);
    }
    
    ctx.fillStyle = '#007bff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Level: ${level}`, 20, canvasHeight - 20);
}

function drawArrow(centerX, y, force, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    const absForce = Math.abs(force);
    const arrowLength = Math.min(absForce * 1.5, 120);
    let fromX, toX;
    if (force >= 0) {
        fromX = centerX - arrowLength / 2;
        toX = centerX + arrowLength / 2;
    } else {
        fromX = centerX + arrowLength / 2;
        toX = centerX - arrowLength / 2;
    }
    // Shaft
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fromX, y);
    ctx.lineTo(toX, y);
    ctx.stroke();
    // Arrowhead
    ctx.lineWidth = 3;
    const headLen = 12;
    const dx = toX - fromX;
    const angle = Math.atan2(0, dx);
    ctx.beginPath();
    ctx.moveTo(toX, y);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function endGame() {
    cancelAnimationFrame(animationId);
    clearInterval(levelInterval);
    isGameRunning = false;
    const finalScore = Math.floor(score);
    document.getElementById('gameResult').innerHTML = `<strong style="color: #ff4400; font-size: 24px;">Game Over! Final Score: ${finalScore} 🎮</strong><br><small>Tip: Hold arrow keys for smooth counter force adjustment.</small>`;
    document.getElementById('startButton').textContent = 'Start Game';
}

function initGameListeners() {
    document.addEventListener('keydown', (e) => {
        if (!isGameRunning) return;
        e.preventDefault();
        if (e.key === 'ArrowLeft') leftPressed = true;
        if (e.key === 'ArrowRight') rightPressed = true;
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') leftPressed = false;
        if (e.key === 'ArrowRight') rightPressed = false;
    });
}

// Quiz Logic (unchanged)
function checkQuiz() {
    const answers = { q1: 'c', q2: 'b', q3: 'a' };
    let score = 0;
    ['q1', 'q2', 'q3'].forEach(q => {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === answers[q]) score++;
    });
    document.getElementById('result').innerHTML = `<strong style="color: #007bff;">You scored ${score} out of 3! 🎉</strong>`;
}