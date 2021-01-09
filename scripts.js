const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.scale(20, 20);
// const posM = 5540

function getPiece (type) {
  switch (type) {
    case "T":
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    case "S":
      return [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ];
    case "Z":
      return [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ];
    case "L":
      return [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ];
    case "J":
      return [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ];
    case "I":
      return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ];
    case "O":
      return [
        [1, 1],
        [1, 1],
      ];
    default:
      break;
  }
}

function collide (arena, player) {
  const [matrix, position] = [player.matrix, player.pos];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (
        (
          matrix[y][x] &&
          arena[y + position.y] &&
          arena[y + position.y][x + position.x]
        ) !== 0
      ) return true;
    }
  }

  return false;
}

function rotate (matrix) {
  const rotatedMatrix = [];

  for (let y = 0; y < matrix.length; y++) {
    const rotatedRow = [];

    for (let x = 0; x < matrix[y].length; x++) {
      rotatedRow.push(matrix[matrix.length-1 - x][y]);
    }

    rotatedMatrix.push(rotatedRow);
  }

  return rotatedMatrix;
}

function createMatrix (width, height) {
  const matrix = [];
  while (height--) matrix.push(new Array(width).fill(0));

  return matrix;
}

function merge (arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
}

// draw figures on canvas
function drawMatrix (matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.beginPath();
        context.fillStyle = "#3f6b30";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

const arena = createMatrix(12, 20);

const player = {
  pos: { x: Math.floor(arena[0].length / 2), y: -1 },
  matrix: getPiece("T"),
};

function draw () {
  context.beginPath();
  context.fillStyle = "#305b6b";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

function playerDrop () {
  player.pos.y++;

  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
  }

  dropCounter = 0;
}

function playerMove (direction) {
  player.pos.x += direction;
  if (collide(arena, player)) player.pos.x -= direction;
}

function playerRotate () {
  const pos = player.pos.x;
  let offset = 1;
  player.matrix = rotate(player.matrix);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix);
      player.pos.x = pos;
      return;
    }
  }
}

function playerReset () {
  const pieces = "IOLJSZT";
  player.matrix = getPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.x = Math.floor(arena[0].length / 2);
  player.pos.y = 0;
}

document.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 37:
      // movement to left
      playerMove(-1);
      break;
    case 38:
      // movement rotaion
      playerRotate();
      break;
    case 39:
      // movement to right
      playerMove(1);
      break;
    case 40:
      // movement to down
      playerDrop();
      break;
    default:
      break;
  }
});

function update (time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();

  context.clearRect(0, 0, canvas.width, canvas.height);

  draw();

  requestAnimationFrame(update);
} update();
