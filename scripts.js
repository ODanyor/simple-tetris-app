// DOM ELEMENTS
const root = document.querySelector("#root")

const playGround = document.createElement("div")
playGround.className = "playground"

// CONTSTANTS
const respawnPosition = { x: 4, y: 0 }
const tetrominos = ["o", "l", "j", "s", "z", "t", "i"]

// VARIABLES
let dropCounter = 0
let dropInterval = 200
let dropIntervalID
let tetromino
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
  [0,0,0,0,0,0,0,0,0,0],
]

const getTetromino = {
  "o": [
      [1,1],
      [1,1],
    ],
  "l": [
      [0,2,0],
      [0,2,0],
      [0,2,2],
    ],
  "j": [
      [0,3,0],
      [0,3,0],
      [3,3,0],
    ],
  "s": [
      [0,4,4],
      [4,4,0],
      [0,0,0],
    ],
  "z": [
      [5,5,0],
      [0,5,5],
      [0,0,0],
    ],
  "t": [
      [6,6,6],
      [0,6,0],
      [0,0,0],
    ],
  "i": [
      [0,7,0,0],
      [0,7,0,0],
      [0,7,0,0],
      [0,7,0,0],
    ],
}

function getColor(number) {
  switch(number) {
    case 1:
      return "#FFFF00"
    case 2:
      return "#F39C12"
    case 3:
      return "#FF00FF"
    case 4:
      return "#FF0000"
    case 5:
      return "#008000"
    case 6:
      return "#800080"
    case 7:
      return "#00FFFF"

    default:
      return "#EEEEEE"
  }
}

function CurrentTetromino(shape, position) {
  let _shape = shape
  let _x = position.x
  let _y = position.y
  
  function rotate(tetro) {
    let rotatedTetro = []
    
    for (let i = 0; i < tetro.length; i++) {
      let row = []
      
      for (let j = 0; j < tetro[i].length; j++) {
        // TODO: wall jump
        row.push(tetro[(tetro.length - 1) - j][i])
      }

      rotatedTetro.push(row)
    }

    _shape = rotatedTetro
  }

  this.isOutOfThePolygon = function() {

  }

  this.rotate = function() {
    undraw({ shape: _shape, position: { x: _x, y: _y }})
    rotate(tetromino)
  }

  this.move = function(action) {
    switch(action) {
      case "left":
        _x--
        break
      case "right":
        _x++
        break
      case "down":
        _y++
        break
      case "rotate":
        this.rotate()
        break

      default:
        break
    }
  }

  this.drop = function() {
    const isDownRowNotEmpty = _shape[_shape.length - 1].some((cell) => cell)

    if (!polygon[_y + _shape.length]) {
      if (!isDownRowNotEmpty && polygon[_y + _shape.length - 1]) {
        undraw({ shape: _shape, position: { x: _x, y: _y }})
        _y++
        return
      }

      freeze()
    } else {
      undraw({ shape: _shape, position: { x: _x, y: _y }})
      _y++
    }
  }

  this.get = function() {
    return { shape: _shape, position: { x: _x, y: _y }}
  }
}

function draw(tetromino) {
  tetromino.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (polygon[tetromino.position.y + y]) {
        if (cell) {
          polygon[tetromino.position.y + y][tetromino.position.x + x] = cell
        }
      }
    })
  })
}

function undraw(tetromino) {
  tetromino.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (polygon[tetromino.position.y + y]) {
        if (cell) {
          polygon[tetromino.position.y + y][tetromino.position.x + x] = 0
        }
      }
    })
  })
}

function freeze() {
  clearInterval(dropIntervalID)
  round()
}

function renderPlayground() {
  playGround.innerHTML = ""

  polygon.forEach((polygonRow) => {
    polygonRow.forEach((polygonRowItem) => {
      const block = document.createElement("div")
      block.className = "block"
      block.style.backgroundColor = getColor(polygonRowItem)

      playGround.appendChild(block)
    })
  })
}

function round() {
  const randomTetrominoShape = getTetromino[tetrominos[Math.floor(Math.random() * tetrominos.length)]]

  tetromino = new CurrentTetromino(randomTetrominoShape, respawnPosition)

  dropIntervalID = setInterval(function() {
    tetromino.drop()
    draw(tetromino.get())

    renderPlayground()
  }, dropInterval)
}

function pause() {
  clearInterval(dropIntervalID)
}

function start() {
  round()

  window.addEventListener("keydown", function(event) {
    undraw(tetromino.get())
    switch(event.keyCode) {
      case 37:
        tetromino.move("left")
        break
      case 38:
        tetromino.move("rotate")
        break
      case 39:
        tetromino.move("right")
        break
      case 40:
        tetromino.move("down")
        break
        
        default:
          break
    }
    renderPlayground()
  })
}

function main() {
  root.appendChild(playGround)
  renderPlayground()

  start()
}

root.addEventListener("onload", main())
