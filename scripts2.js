const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const constants = { TIMER_INTERVAL: 1000 }; // constants

class Game {
  constructor (name) {
    this.name = name; // player name
    this.score = 0;
    this.lines = 0;
    
    this.timer = null;
    this.timerCounter = 0;
    this.dropper = null;
    this.dropInterval = 1000;

    this.piece = null; // current player tetromino
    this.x = 0; // position x of piece
    this.y = 0; // position y of piece

    this.arena = this.createMatrix(8, 20); // playground
  }

  createMatrix (width, height) {
    const matrix = [];
    while (height--) matrix.push(new Array(width).fill(0));

    return matrix;
  }

  startTimer () {
    this.timer = setInterval(() => this.timerCounter++, constants.TIMER_INTERVAL);
  }

  stopTimer () {
    clearInterval(this.timer);
  }

  start () {
    this.dropper = setInterval(() => this.render(), this.dropInterval);
  }

  stop () {
    clearInterval(this.dropper);
  }

  render () {
    console.log("RENDER");
  }

  draw () {
    context.clearRect(0, 0, 240, 400);

    // draw on canvas after render ...

    requestAnimationFrame(this.draw());
  }
}

function main () {
  const game = new Game("player1");
  console.log("GAME IS LOADED", game);
}

window.addEventListener("load", main);
