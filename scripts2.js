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

  merge () {
    console.log("MERGE: piece to arena");
  }

  collide () {
    console.log("COLLIDE: true | false");
  }

  drop () {
    this.y++; // TODO: collide check
    if (this.collide()) {
      this.y--;
      this.merge();
      this.round();
    }
  }

  move (direction) {
    this.x += direction; // TODO: collide check
    if (this.collide()) this.x -= direction;
  }

  rotate () {
    console.log("ROTATE"); // TODO: collide check
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
          this.rotate();
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
