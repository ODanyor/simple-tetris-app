const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const variables = {
  T_INTERVAL: 1000, // timer interval
  D_INTERVAL: 1000, // initial drop interval
};

class Game {
  constructor (name) {
    this.name = name; // player name
    this.score = 0;
    this.lines = 0;

    this.timer = null;
    this.timerCounter = 0;
    this.dropper = null;
    this.dropperInterval = variables.D_INTERVAL;

    this.piece = null; // current player tetromino
    this.x = 0; // position x of piece | TODO: figure out the center of arena according to the piece
    this.y = 0; // position y of piece

    this.arena = this.createMatrix(8, 20);
  }

  round () {
    this.x = 0;
    this.y = 0;
    this.piece = this.getPiece("T"); // TODO: get random piece
  }

  drop () {
    console.log("DROP PIECE");
  }

  move () {
    console.log("MOVE PIECE");
  }

  getPiece (name) {
    switch (name) {
      case "T":
        return [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0],
        ];
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

  start () {
    this.startTimer();
    this.dropper = setInterval(() => this.render(), this.dropperInterval);
  }

  stop () {
    this.stopTimer();
    clearInterval(this.dropper);
  }

  render () {
    console.log("RENDER");
  }

  draw () {
    context.clearRect(0, 0, 240, 400);

    // draw arena on canvas ...

    requestAnimationFrame(this.draw());
  }
}

function main () {
  const game = new Game("player1");
  console.log("GAME IS LOADED", game);
}

window.addEventListener("load", main);
