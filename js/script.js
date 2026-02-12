// js/script.js (updated with fixed game drawing)
let actionForce = 0;
let counterForce = 0;
let ctx;

function updateCounterValue() {
    counterForce = parseInt(document.getElementById('counterForceSlider').value);
    document.getElementById('counterValue').textContent = counterForce;
    drawGame();
    checkBalance();
}

function startGame() {
    actionForce = Math.floor(Math.random() * 201) - 100; // -100 to 100
    counterForce = 0;
    document.getElementById('counterForceSlider').value = 0;
    document.getElementById('counterValue').textContent = 0;
    document.getElementById('gameResult').innerHTML = '';
    const canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    drawGame();
}

function drawGame() {
    const canvas = document.getElementById('gameCanvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center zero line
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 60);
    ctx.lineTo(200, 190);
    ctx.stroke();
    
    const scale = 1.5;
    
    // Action force bar (blue)
    ctx.fillStyle = '#007bff';
    const absAction = Math.abs(actionForce);
    const actionLength = absAction * scale;
    if (actionForce >= 0) {
        ctx.fillRect(200, 80, actionLength, 20);
    } else {
        ctx.fillRect(200 - actionLength, 80, actionLength, 20);
    }
    
    // Counter force bar (red)
    ctx.fillStyle = '#ff0000';
    const absCounter = Math.abs(counterForce);
    const counterLength = absCounter * scale;
    if (counterForce >= 0) {
        ctx.fillRect(200, 110, counterLength, 20);
    } else {
        ctx.fillRect(200 - counterLength, 110, counterLength, 20);
    }
    
    // Net force bar (green if zero, orange otherwise)
    const net = actionForce + counterForce;
    ctx.fillStyle = net === 0 ? '#00ff00' : '#ff8800';
    const absNet = Math.abs(net);
    const netLength = absNet * scale;
    if (net >= 0) {
        ctx.fillRect(200, 150, netLength, 20);
    } else {
        ctx.fillRect(200 - netLength, 150, netLength, 20);
    }
    
    // Labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Action: ${actionForce} N`, 10, 70);
    ctx.fillText(`Counter: ${counterForce} N`, 10, 105);
    ctx.fillText(`Net: ${net} N`, 10, 145);
    
    ctx.font = '14px Arial';
    ctx.fillText('← Negative     Positive →', 150, 35);
}

function checkBalance() {
    const net = actionForce + counterForce;
    if (net === 0) {
        document.getElementById('gameResult').innerHTML = '<strong style="color: green;">Balanced! Great job! 🎉</strong>';
    } else {
        document.getElementById('gameResult').innerHTML = `Net force: ${net} N (adjust slider to make it 0)`;
    }
}

// Quiz Logic (unchanged)
function checkQuiz() {
    const answers = {
        q1: 'c',
        q2: 'b',
        q3: 'a'
    };
    let score = 0;
    const questions = ['q1', 'q2', 'q3'];
    questions.forEach(q => {
        const selected = document.querySelector(`input[name="${q}"]:checked`);
        if (selected && selected.value === answers[q]) {
            score++;
        }
    });
    document.getElementById('result').innerHTML = `<strong>You scored ${score} out of 3!</strong>`;
}