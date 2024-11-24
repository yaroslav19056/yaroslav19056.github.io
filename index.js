// Настройки
const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

const gridSize = 350; // Размер сетки 1000x1000 клеток
const cellSize = 10;  // Размер каждой клетки (в пикселях)
canvas.width = window.innerWidth; // Полный размер окна
canvas.height = window.innerHeight;

let currentColor = colorPicker.value;

// Слушатель изменения цвета
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

// Данные пикселей (цвета)
const pixelData = Array.from({ length: gridSize }, () =>
  Array(gridSize).fill('#ffffff')
);

// Управление масштабом и перемещением
let scale = 1;
let offsetX = 0;
let offsetY = 0;

// Отрисовка видимой области
function drawVisibleGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scaledCellSize = cellSize * scale;

  const startX = Math.floor(-offsetX / scaledCellSize);
  const startY = Math.floor(-offsetY / scaledCellSize);

  const endX = Math.ceil((canvas.width - offsetX) / scaledCellSize);
  const endY = Math.ceil((canvas.height - offsetY) / scaledCellSize);

  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 0.5;

  // Рисуем сетку
  for (let x = startX; x <= endX; x++) {
    ctx.beginPath();
    ctx.moveTo(x * scaledCellSize + offsetX, 0);
    ctx.lineTo(x * scaledCellSize + offsetX, canvas.height);
    ctx.stroke();
  }
  for (let y = startY; y <= endY; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * scaledCellSize + offsetY);
    ctx.lineTo(canvas.width, y * scaledCellSize + offsetY);
    ctx.stroke();
  }

  // Рисуем клетки
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (x >= 0 && y >= 0 && x < gridSize && y < gridSize) {
        ctx.fillStyle = pixelData[y][x];
        ctx.fillRect(
          x * scaledCellSize + offsetX,
          y * scaledCellSize + offsetY,
          scaledCellSize,
          scaledCellSize
        );
      }
    }
  }
}

// Окрашивание клетки
function paintCell(x, y, color) {
  if (x >= 0 && y >= 0 && x < gridSize && y < gridSize) {
    pixelData[y][x] = color;
    drawVisibleGrid();
  }
}

// Получение координат клетки по клику
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left - offsetX) / (cellSize * scale));
  const y = Math.floor((e.clientY - rect.top - offsetY) / (cellSize * scale));
  paintCell(x, y, currentColor);
});

// Масштабирование (зум)
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const zoomSpeed = 0.1;
    const mouseX = e.clientX - canvas.offsetLeft; // Положение мыши относительно холста
    const mouseY = e.clientY - canvas.offsetTop;
  
    // Координаты на холсте до изменения масштаба
    const canvasX = (mouseX - offsetX) / scale;
    const canvasY = (mouseY - offsetY) / scale;
  
    // Изменяем масштаб
    const oldScale = scale;
    scale += e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    scale = Math.max(0.1, Math.min(scale, 10)); // Ограничиваем масштаб
  
    // Корректируем смещение
    offsetX -= (canvasX * scale - canvasX * oldScale);
    offsetY -= (canvasY * scale - canvasY * oldScale);
  
    drawVisibleGrid();
  });
  

// Перетаскивание (панорамирование)
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStartX = e.clientX - offsetX;
  dragStartY = e.clientY - offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    drawVisibleGrid();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Инициализация
drawVisibleGrid();
