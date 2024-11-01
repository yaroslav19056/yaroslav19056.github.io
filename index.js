const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let balance = 0;
let objects = [];
let objectSize = 60; // Размер изображения (30x30 пикселей)
let objectSpeed = 4;


function setCanvasSize() {
            canvas.width = window.innerWidth; // устанавливаем ширину канваса равной ширине окна
            canvas.height = window.innerHeight; // устанавливаем высоту канваса равной высоте окна
}

        // Вызываем функцию при загрузке страницы и при изменении размеров окна
window.onload = setCanvasSize;
window.onresize = setCanvasSize;

// Загрузка изображения
const appleImage = new Image();
appleImage.src = 'fimozzBgTransp.png';

// Определяем размер хитбокса (на 20px больше объекта: по 10px с каждой стороны)
const hitboxPadding = 20;
const hitboxSize = objectSize + hitboxPadding * 2; // новый размер хитбокса

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
