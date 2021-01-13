const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const configs = {
  W_ARENA: 8, // arena width
  H_ARENA: 20, // arena height
};

const variables = {
  T_INTERVAL: 1000, // timer interval
  D_INTERVAL: 1000, // initial drop interval
};

const tetrominos = [
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
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
    this.x = 0; // position x of piece | TODO: figure out the center of arena according to the piece
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
        if (value) arena[y + this.y][x + this.x] = value; // TODO: fix bug value of 'undefined'
      });
    });
  }

  collide (arena, matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] && arena[y + this.y] && arena[x + this.x]) return false;
      }
    }

    return true;
  }

  rotate (matrix) {
    const previousTetromino = matrix;
    const rotatedTetromino = [];

    for (let y = 0; y < matrix.length; y++) {
      const rotatedRow = [];
      for (let x = 0; x < matrix[y].length; x++) rotatedRow.push(matrix[y][x]);
      rotatedTetromino.push(rotatedRow);
    }

    if (this.collide(this.arena, rotatedTetromino)) return previousTetromino;

    return rotatedTetromino;
  }

  // =======@GAMEPLAY@=======
  drop () {
    this.y++;
    if (this.collide(this.arena, this.tetromino)) {
      this.y--;
      this.merge(this.arena, this.tetromino);
      this.round();
    }
  }

  move (direction) {
    this.x += direction;
    if (this.collide(this.arena, this.tetromino)) this.x -= direction;
  }

  jump () {
    let steps = 1;
    let direction = 1;

    while (
      this.collide(this.arena, this.tetromino) &&
      steps <= this.tetromino.length / 2 | 0
    ) {
      this.x += steps * direction;
      this.steps++;
      direction *= -1;
    }
  }

  // =======@GAME CONTROLLERS@=======
  setupKeyboard () {
    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 13: // ENTER
          console.log("ENTER");
          break;
        case 27: // ESC
          console.log("ESC");
          break;
        case 37: // ARROW LEFT
          this.move(-1);
          break;
        case 39: // ARROW RIGHT
          this.move(1);
          break;
        case 38: // ARROW UP
          this.rotate(this.tetromino);
          break;
        case 40: // ARROW DOWN
          this.stopDropper();
          this.drop();
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

  round () {
    const tetrominoKeys = "OTSZLJI";
    const randomKeyIndex = Math.random() * tetrominoKeys.length | 0;

    this.x = 0;
    this.y = 0;
    this.tetromino = this.getTetromino(tetrominoKeys[randomKeyIndex]);
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

  // fired by dropper interval function
  render () {
    this.drop();
    if (this.collide(this.arena, this.tetromino)) {
      this.y--;
      this.merge(this.arena, this.tetromino);
    }
  }

  draw () {
    context.clearRect(0, 0, 240, 400);

    // draw arena on canvas ...

    requestAnimationFrame(this.draw());
  }

  preload () {
    this.setupKeyboard();
    this.round();
  }
}

function main () {
  const game = new Game("player1");
  game.start();
  console.log("GAME IS LOADED", game);
}

window.addEventListener("load", main);
