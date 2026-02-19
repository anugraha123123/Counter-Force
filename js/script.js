const canvas = document.getElementById('gameCanvas');

// Make canvas focusable and auto-focus on start
canvas.setAttribute('tabindex', '0');  // Makes it focusable
canvas.style.outline = 'none';         // Removes visible focus border

// Auto-focus canvas when game starts (or on page load)
function startGame() {
    // ... your existing reset code ...

    canvas.focus();   // ← This is key!
    log("Canvas focused for arrow keys");  // optional debug
}