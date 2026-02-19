let actionForce = 0;
let counterForce = 0;
let ctx;
let ballX = 250;
let velocity = 0;
let score = 0;
let time = 0;
let isRunning = false;
let timerId, gameLoopId;

const canvas = document.getElementById('gameCanvas');
const ctxCanvas = canvas.getContext('2d');
const center = canvas.width / 2;
const platformLeft = 80;
const platformRight = 420;

function startGame() {
    if (isRunning) {
        clearInterval(timerId);
        cancelAnimationFrame(gameLoopId);
    }

    actionForce = Math.floor(Math.random() * 81) - 40; // -40 to +40
    counterForce = 0;
    ballX = center;
    velocity = 0;
    score = 0;
    time = 0;

    document.getElementById('counterValue').textContent = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('timer').textContent = 'Time: 0 s';
    document.getElementById('gameResult').innerHTML = '';
    document.getElementById('startButton').textContent = 'Reset Game';

    isRunning = true;
    timerId = setInterval(updateTimer, 1000);
    gameLoop();
}

function updateTimer() {
    if (!isRunning) return;
    time++;
    document.getElementById('timer').textContent = `Time: ${time} s`;

    // Bonus points when well balanced
    if (Math.abs(actionForce + counterForce) < 8) {
        score += 15;
        document.getElementById('score').textContent = `Score: ${score}`;
    }
}

function gameLoop() {
    if (!isRunning) return;

    const net = actionForce + counterForce;

    // Very gentle physics
    velocity += net * 0.004;           // very small acceleration
    velocity *= 0.93;                  // strong damping
    ballX += velocity * 18;            // slow movement

    // Game over
    if (ballX < platformLeft - 30 || ballX > platformRight + 30) {
        isRunning = false;
        clearInterval(timerId);
        document.getElementById('gameResult').innerHTML =
            `<span style="color:#dc3545; font-size:1.3em;">Game Over! Final score: ${score}</span>`;
        document.getElementById('startButton').textContent = 'Start Game';
        return;
    }

    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function draw() {
    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

    // Platform
    ctxCanvas.fillStyle = '#6c757d';
    ctxCanvas.fillRect(platformLeft, 220, platformRight - platformLeft, 25);

    // Ball
    ctxCanvas.fillStyle = '#dc3545';
    ctxCanvas.beginPath();
    ctxCanvas.arc(ballX, 210, 14, 0, Math.PI * 2);
    ctxCanvas.fill();

    // Force arrows
    drawArrow(center - 80, 60, actionForce,   '#0d6efd', 'Action');
    drawArrow(center - 80, 95, counterForce,  '#fd7e14', 'Counter');
    const net = actionForce + counterForce;
    drawArrow(center - 80, 130, net, net < 12 && net > -12 ? '#198754' : '#dc3545', 'Net');

    document.getElementById('counterValue').textContent = Math.round(counterForce);
}

function drawArrow(x, y, val, color, label) {
    const len = Math.min(Math.abs(val) * 1.8, 140);
    const dir = val >= 0 ? 1 : -1;

    ctxCanvas.strokeStyle = color;
    ctxCanvas.lineWidth = 5;
    ctxCanvas.beginPath();
    ctxCanvas.moveTo(x, y);
    ctxCanvas.lineTo(x + len * dir, y);
    ctxCanvas.stroke();

    // arrow head
    ctxCanvas.beginPath();
    ctxCanvas.moveTo(x + len * dir, y);
    ctxCanvas.lineTo(x + (len - 14) * dir, y - 9);
    ctxCanvas.lineTo(x + (len - 14) * dir, y + 9);
    ctxCanvas.closePath();
    ctxCanvas.fillStyle = color;
    ctxCanvas.fill();

    ctxCanvas.fillStyle = '#333';
    ctxCanvas.font = '14px Arial';
    ctxCanvas.fillText(`${label}: ${Math.round(val)} N`, x - 20, y - 12);
}

function initGameListeners() {
    document.addEventListener('keydown', e => {
        if (!isRunning) return;
        if (e.key === 'ArrowLeft')  counterForce -= 1.5;
        if (e.key === 'ArrowRight') counterForce += 1.5;
        counterForce = Math.max(-120, Math.min(120, counterForce));
    });
}

document.getElementById('startButton').addEventListener('click', startGame);