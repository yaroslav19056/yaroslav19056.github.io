const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let balance = 0;
let objects = [];
let objectSize = 60; // Image size
let objectSpeed = 4;
let spawnRate = 0.05; // Initial spawn rate for objects

// Adjust canvas size
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Debounce resize function
let resizeTimeout;
window.onresize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(setCanvasSize, 100);
};
window.onload = setCanvasSize;

// Load image
const appleImage = new Image();
appleImage.src = 'fimozzBgTransp.png';

const hitboxPadding = 20;
const hitboxSize = objectSize + hitboxPadding * 2;

// Create new object
function createObject() {
  const x = Math.random() * (canvas.width - objectSize);
  const y = -objectSize;
  objects.push({ x, y });
}

// Update object positions
function updateObjects() {
  for (let i = 0; i < objects.length; i++) {
    objects[i].y += objectSpeed;

    if (objects[i].y > canvas.height) {
      objects.splice(i, 1);
      i--;
    }
  }
}

// Handle mouse clicks for object removal and scoring
canvas.addEventListener('click', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    if (
      mouseX > obj.x - hitboxPadding &&
      mouseX < obj.x + objectSize + hitboxPadding &&
      mouseY > obj.y - hitboxPadding &&
      mouseY < obj.y + objectSize + hitboxPadding
    ) {
      balance += 10;
      objects.splice(i, 1);
      break;
    }
  }
});

// Render objects and score
function drawObjects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Display balance with background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Background for balance
  ctx.fillRect(0, 0, 120, 40);
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Balance: ${balance}`, 10, 30);

  // Display objects
  for (let obj of objects) {
    ctx.drawImage(appleImage, obj.x, obj.y, objectSize, objectSize);
  }
}

// Main game loop
function gameLoop() {
  if (Math.random() < spawnRate) {
    createObject();
  }

  updateObjects();
  drawObjects();
  requestAnimationFrame(gameLoop);
}

// Start game after image loads
appleImage.onload = () => {
  gameLoop();
};
