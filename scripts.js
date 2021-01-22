const timer = document.getElementById("timer");
const score = document.getElementById("score");
const lines = document.getElementById("lines");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const configs = {
  S_ARENA: 40, // arena scale
  W_ARENA: 12, // arena width
  H_ARENA: 20, // arena height
};

const variables = {
  T_INTERVAL: 1000, // timer interval
  D_INTERVAL: 1000, // initial drop interval

  TETROMINOS: "OTSZLJI", // tetromino keys
};

const scaledArenaWidth = configs.W_ARENA * configs.S_ARENA;
const scaledArenaHeight = configs.H_ARENA * configs.S_ARENA;

const tetrominos = [
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 0, 0],
    [2, 2, 2],
    [0, 2, 0],
  ],
  [
    [0, 0, 0],
    [0, 3, 3],
    [3, 3, 0],
  ],
  [
    [0, 0, 0],
    [4, 4, 0],
    [0, 4, 4],
  ],
  [
    [0, 5, 0],
    [0, 5, 0],
    [0, 5, 5],
  ],
  [
    [0, 6, 0],
    [0, 6, 0],
    [6, 6, 0],
  ],
  [
    [0, 7, 0, 0],
    [0, 7, 0, 0],
    [0, 7, 0, 0],
    [0, 7, 0, 0],
  ],
];

const colors = [
  "#003747", // background
  "#ba3d3d", // red
  "#c0d16b", // yellow
  "#a87132", // brown
  "#4ca832", // green
  "#32a8a2", // green-blue
  "#325da8", // blue
  "#7532a8", // purple
];

class Game {
  constructor (name) {
    this.name = name; // player name
    this.score = 0;
    this.lines = 0;

    this.timer = null;
    this.timerCounter = 0;
    this.dropper = null;
    this.dropperInterval = variables.D_INTERVAL;

    this.tetromino = null; // current player tetromino
    this.x = 0; // position x of piece
    this.y = 0; // position y of piece

    this.arena = this.createMatrix(configs.W_ARENA, configs.H_ARENA);

    this.preload();
  }

  // =======@UNIVERSAL@=======
  createMatrix (width, height) {
    const matrix = [];
    while (height--) matrix.push(new Array(width).fill(0));

    return matrix;
  }

  merge (arena, matrix) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) arena[y + this.y][x + this.x] = value;
      });
    });

    this.sweepLines();
  }

  collide (arena, matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (
          (
            matrix[y][x] &&
            arena[this.y + y] &&
            arena[this.y + y][this.x + x]
          ) !== 0
        ) return true;
      }
    }

    return false;
  }

  rotate (matrix) {
    const rotatedTetromino = [];

    for (let y = 0; y < matrix.length; y++) {
      const rotatedRow = [];
      for (let x = matrix[y].length - 1; x >= 0; x--) rotatedRow.push(matrix[x][y]);
      rotatedTetromino.push(rotatedRow);
    }

    return rotatedTetromino;
  }

  // =======@GAMEPLAY@=======
  dropPlayer () {
    this.y++;
    if (this.collide(this.arena, this.tetromino)) {
      this.y--;
      this.merge(this.arena, this.tetromino);
      this.round();
    }
  }

  movePlayer (direction) {
    this.x += direction;
    if (this.collide(this.arena, this.tetromino)) this.x -= direction;
  }

  rotatePlayer () {
    const previousX = this.x; // previous x tetromino position
    const previousT = this.tetromino.slice(); // previous tetromino rotation

    let offset = -1;
    this.tetromino = this.rotate(this.tetromino);

    while (this.collide(this.arena, this.tetromino)) {
      this.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > this.tetromino.length) {
        this.x = previousX;
        this.tetromino = previousT;
        break;
      }
    }
  }

  // =======@GAME CONTROLLERS@=======
  setupKeyboard () {
    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 13: // ENTER
          this.start();
          break;
        case 27: // ESC
          this.stop();
          break;
        case 37: // ARROW LEFT
        case 65: // A
          this.movePlayer(-1);
          break;
        case 39: // ARROW RIGHT
        case 68: // D
          this.movePlayer(1);
          break;
        case 32: // SPACE
        case 38: // ARROW UP
        case 87: // W
          this.rotatePlayer();
          break;
        case 40: // ARROW DOWN
        case 83: // S
          this.stopDropper();
          this.dropPlayer();
          this.score += 5;
          this.startDropper();
          break;
        default:
          break;
      }
    });
  }

  getTetromino (tetrominoKey) {
    switch (tetrominoKey) {
      case "O":
        return tetrominos[0];
      case "T":
        return tetrominos[1];
      case "S":
        return tetrominos[2];
      case "Z":
        return tetrominos[3];
      case "L":
        return tetrominos[4];
      case "J":
        return tetrominos[5];
      case "I":
        return tetrominos[6];
      default:
        break;
    }
  }

  sweepLines () {
    let solidLines = 0;

    for (let y = this.arena.length - 1; y >= 0; y--) {
      const isSolidLine = this.arena[y].every(value => value);

      if (!isSolidLine) continue;

      const solidLine = this.arena.splice(y, 1)[0].fill(0);
      this.arena.unshift(solidLine);

      solidLines++;
      y++;
    }
    
    this.score += solidLines * 100; // TODO: nintendo scoring system
    this.lines += solidLines;
  }

  round () {
    const tetrominoKeys = variables.TETROMINOS;
    const randomKeyIndex = Math.random() * tetrominoKeys.length | 0;
    const randomTetromino = this.getTetromino(tetrominoKeys[randomKeyIndex]);
    const widthCenter = (configs.W_ARENA - randomTetromino.length) / 2 | 0;

    this.x = widthCenter;
    this.y = 0; // TODO: figure out the toppest y position
    this.tetromino = randomTetromino;

    if (this.collide(this.arena, this.tetromino)) this.gameOver();
  }

  startTimer () {
    this.timer = setInterval(() => this.timerCounter++, variables.T_INTERVAL);
  }

  stopTimer () {
    clearInterval(this.timer);
  }

  startDropper () {
    this.dropper = setInterval(() => this.render(), this.dropperInterval);
  }

  stopDropper () {
    clearInterval(this.dropper);
  }

  start () {
    this.startTimer();
    this.startDropper();
  }

  stop () {
    this.stopTimer();
    this.stopDropper();
  }

  gameOver () {
    this.stop();
  }

  updateIndicators () {
    timer.innerText = timeConverter(this.timerCounter);
    score.innerText = this.score;
    lines.innerText = this.lines;
  }

  render () {
    this.dropPlayer();
  }

  drawMatrix (matrix, position) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          context.beginPath();
          context.fillStyle = colors[value];
          context.fillRect(position.x + x, position.y + y, 1, 1);
        }
      });
    });
  }

  draw () {
    // DESC: paints the canvas
    context.beginPath();
    context.fillStyle = colors[0];
    context.fillRect(0, 0, canvas.width, canvas.height);

    this.drawMatrix(this.arena, { x: 0, y: 0 });
    this.drawMatrix(this.tetromino, { x: this.x, y: this.y });
  }

  setupCanvas () {
    canvas.width = scaledArenaWidth;
    canvas.height = scaledArenaHeight;
    context.scale(configs.S_ARENA, configs.S_ARENA);
  }

  preload () {
    this.setupCanvas();
    this.setupKeyboard();
    this.round();
  }
}

function timeConverter (seconds) {
  let min = seconds / 60 | 0;
  let sec = seconds % 60;

  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;

  min = String(min);
  sec = String(sec);

  return min.concat(":", sec);
}

function stream (game) { // DESC: will demonstrate game proccess on the canvas
  context.clearRect(0, 0, scaledArenaWidth, scaledArenaHeight);

  game.draw();
  game.updateIndicators();

  requestAnimationFrame(() => stream(game));
}

function main () {
  const game = new Game("player");
  game.start();
  stream(game);
}


window.addEventListener("load", main);
