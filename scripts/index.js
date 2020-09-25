const root = document.querySelector("#root");

// CONTSTANTS
const respawnPosition = { x: 4, y: 0 };

// VARIABLES
let dropCounter = 0;
let dropInterval = 1000;

// POLYGON
let polygon = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [9,9,9,9,9,9,9,9,9,9],
];

function getTetromino(name) {
  switch (name) {
    case "o":
      return [
        [1,1],
        [1,1],
      ];
    case "l":
      return [
        [0,2,0],
        [0,2,0],
        [0,2,2],
      ];
    case "j":
      return [
        [0,3,0],
        [0,3,0],
        [3,3,0],
      ];
    case "s":
      return [
        [0,4,4],
        [4,4,0],
        [0,0,0],
      ];
    case "z":
      return [
        [5,5,0],
        [0,5,5],
        [0,0,0],
      ];
    case "t":
      return [
        [6,6,6],
        [0,6,0],
        [0,0,0],
      ]
    case "i":
      return [
        [0,0,7,0],
        [0,0,7,0],
        [0,0,7,0],
        [0,0,7,0],
      ]
    default:
      return null;
  }
}

function CurrentTetromino(shape, position) {
  let _shape = shape;
  let _x = position.x;
  let _y = position.y;
  
  function rotate(tetro) {
    let rotatedTetro = [];

    for (let i = 0; i < tetro.length; i++) {
      let row = [];

      for (let j = 0; j < tetro[i].length; j++) {
        row.push(tetro[(tetro.length - 1) - j][i]);
      }

      rotatedTetro.push(row);
    }

    _shape = rotatedTetro;
  };

  this.rotate = function() {
    rotate(tetromino);
  };

  this.drop = function() {
    _y++;
  };

  this.get = function() {
    return { shape: _shape, position: { x: _x, y: _y }};
  };
};

function draw(tetromino) {
  for (let i = 0; i < tetromino.shape.length; i++) {
    for (let j = 0; j < tetromino.shape[i].length; j++) {
      if (tetromino.shape[i][j] !== 0) {
        polygon[tetromino.position.y + i][tetromino.position.x + j] = tetromino.shape[i][j];
      };
    };
  };
};

function undraw(tetromino) {
  for (let i = 0; i < tetromino.shape.length; i++) {
    for (let j = 0; j < tetromino.shape[i].length; j++) {
      if (tetromino.shape[i][j] !== 0) {
        polygon[tetromino.position.y + i][tetromino.position.x + j] = 0;
      };
    };
  };
};

function main() {
  const randomTetrominoShape = getTetromino("j");
  const tetromino = new CurrentTetromino(randomTetrominoShape, respawnPosition);
  draw(tetromino.get());

  let timerId = setInterval(function() {
    tetromino.drop();
    draw(tetromino.get());
    console.log(tetromino.get());
  }, dropInterval);
  
  // clearInterval(timerId);
};

root.addEventListener("onload", main());
