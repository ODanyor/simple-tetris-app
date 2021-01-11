const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

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

    this.arena = this.createMatrix(8, 20);

    this.preload();
  }

  // @UNIVERSAL
  merge (arena, tetromino) {
    tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) arena[y + this.y][x + this.x] = value;
      });
    });
  }

  // @UNIVERSAL
  collide (arena, tetromino) {
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x] && arena[y + this.y] && arena[x + this.x]) return true;
      }
    }
  }

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

  // @UNIVERSAL
  rotate (tetromino) {
    const previousTetromino = tetromino;
    const rotatedTetromino = [];

    for (let y = 0; y < this.tetromino.length; y++) {
      const rotatedRow = [];

      for (let x = 0; x < this.tetromino[y].length; x++) {
        rotatedRow.push(this.tetromino[y][x]);
      }

      rotatedTetromino.push(rotatedRow);
    }

    if (this.collide(this.arena, rotatedTetromino)) return previousTetromino;

    return rotatedTetromino;
  }

  controller () {
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

  round () {
    const tetrominoKeys = "OTSZLJI";
    const randomTetrominoKey = Math.random() * tetrominoKeys.length | 0;

    this.x = 0;
    this.y = 0;
    this.tetromino = this.getTetromino(randomTetrominoKey);
  }

  getTetromino (tetriminoKey) {
    switch (tetriminoKey) {
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

  // @UNIVERSAL
  createMatrix (width, height) {
    const matrix = [];
    while (height--) matrix.push(new Array(width).fill(0));

    return matrix;
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
    console.log("RENDER");
  }

  draw () {
    context.clearRect(0, 0, 240, 400);

    // draw arena on canvas ...

    requestAnimationFrame(this.draw());
  }

  preload () {
    this.controller();
  }
}

function main () {
  const game = new Game("player1");
  console.log("GAME IS LOADED", game);
}

window.addEventListener("load", main);
