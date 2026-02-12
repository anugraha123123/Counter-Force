// js/script.js (ULTIMATE PLAYABLE VERSION: SUPER SLOW BALL, FAST CONTROLS, PERFECT BALANCE - TESTED!)
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
const platformLeft = 100;
const platformRight = 500;
const mass =