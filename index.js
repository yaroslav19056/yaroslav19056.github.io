const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let balance = 0;
let objects = [];
let objectSize = 30; // Размер изображения (30x30 пикселей)
let objectSpeed = 2;

// Загрузка изображения
const appleImage = new Image();
appleImage.src = '/fmztptp2-11.png'; // Замените на путь к вашему изображению

// Создание нового объекта
function createObject() {
  const x = Math.random() * (canvas.width - objectSize);
  const y = -objectSize;
  
  objects.push({ x, y });
}

// Анимация падения объектов
function updateObjects() {
  for (let i = 0; i < objects.length; i++) {
    objects[i].y += objectSpeed;

    if (objects[i].y > canvas.height) {
      objects.splice(i, 1);
      i--;
    }
  }
}

// Обработка нажатий мыши
canvas.addEventListener('click', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    if (
      mouseX > obj.x &&
      mouseX < obj.x + objectSize &&
      mouseY > obj.y &&
      mouseY < obj.y + objectSize
    ) {
      balance += 10;
      objects.splice(i, 1);
      break;
    }
  }
});

// Рендеринг объектов и текста баланса
function drawObjects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Отображение баланса
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Баланс: ${balance}`, 10, 30);

  // Отображение объектов (яблок)
  for (let obj of objects) {
    ctx.drawImage(appleImage, obj.x, obj.y, objectSize, objectSize);
  }
}

// Основной игровой цикл
function gameLoop() {
  if (Math.random() < 0.05) {
    createObject();
  }

  updateObjects();
  drawObjects();
  requestAnimationFrame(gameLoop);
}

// Запуск игры после загрузки изображения
appleImage.onload = () => {
  gameLoop();
};
