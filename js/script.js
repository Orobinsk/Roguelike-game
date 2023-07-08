const rows = 24
const columns = 40
const tileSize = 25
const field = document.querySelector('.field')
let map = []

function createDiv(classNames, top, left) {
  const div = document.createElement('div')
  classNames.forEach((className) => {
    div.classList.add(className)
  })
  div.style.top = top * tileSize + 'px'
  div.style.left = left * tileSize + 'px'
  field.appendChild(div)
  return div
}

function drawMap() {
  map = new Array(rows)
  for (let i = 0; i < rows; i++) {
    map[i] = new Array(columns)
    for (let j = 0; j < columns; j++) {
      const div = createDiv(['field', 'tile', 'tileW'], i, j)
      map[i][j] = div
    }
  }
}

function drawRoom() {
  const roomQuantity = Math.floor(Math.random() * (10 - 5 + 1) + 5)

  for (let i = 0; i < roomQuantity; i++) {
    const roomRow = Math.floor(Math.random() * (8 - 3 + 1) + 3)
    const roomCol = Math.floor(Math.random() * (8 - 3 + 1) + 3)

    const startRow = Math.floor(Math.random() * (rows - roomRow + 1))
    const startCol = Math.floor(Math.random() * (columns - roomCol + 1))

    for (let k = startRow; k < startRow + roomRow; k++) {
      for (let j = startCol; j < startCol + roomCol; j++) {
        let div = createDiv(['field', 'tile'], k, j)
        map[k][j] = div
      }
    }
  }
}

drawMap()
drawRoom()

function drowRoad() {
  function RoadRow() {
    let RoadQuantity = Math.floor(Math.random() * (6 - 3) + 3)
    for (let i = 0; i < RoadQuantity; i++) {
      let startRow = Math.floor(Math.random() * rows)
      for (let k = 0; k < columns; k++) {
        let div = createDiv(['field', 'tile'], startRow, k)
        map[startRow][k] = div
      }
    }
  }
  function RoadCol() {
    let RoadQuantity = Math.floor(Math.random() * (6 - 3 + 1) + 3)
    for (let i = 0; i < RoadQuantity; i++) {
      let startCol = Math.floor(Math.random() * columns)
      for (let k = 0; k < rows; k++) {
        let div = createDiv(['field', 'tile'], k, startCol)
        map[k][startCol] = div
      }
    }
  }
  RoadCol()
  RoadRow()
}

function drowItems() {
  function drowTileSW(count) {
    if (count > 0) {
      let y = Math.floor(Math.random() * columns)
      let x = Math.floor(Math.random() * rows)
      if (map[x][y].classList.value === 'field tile') {
        let div = createDiv(['field', 'tile', 'tileSW'], x, y)
        map[x][y] = div
        count -= 1
        drowTileSW(count)
      } else drowTileSW(count)
    }
  }
  function drowTileHP(count) {
    if (count > 0) {
      let y = Math.floor(Math.random() * columns)
      let x = Math.floor(Math.random() * rows)
      if (map[x][y].classList.value === 'field tile') {
        let div = createDiv(['field', 'tile', 'tileHP'], x, y)
        map[x][y] = div
        count -= 1
        drowTileHP(count)
      } else drowTileHP(count)
    }
  }
  drowTileHP(10)
  drowTileSW(2)
}
function drowWarior(count) {
  if (count > 0) {
    let y = Math.floor(Math.random() * columns)
    let x = Math.floor(Math.random() * rows)
    if (map[x][y].classList.value === 'field tile') {
      let div = createDiv(['field', 'tile', 'tileE'], x, y)
      map[x][y] = div
      count -= 1
      drowWarior(count)
    } else drowWarior(count)
  }
}

let Py, Px

function drawPerson() {
  Py = getRandomPosition(columns);
  Px = getRandomPosition(rows);

  while (!isFieldTile(Px, Py)) {
    Py = getRandomPosition(columns);
    Px = getRandomPosition(rows);
  }

  const div = createDiv(['field', 'tile', 'tileP'], Px, Py);
  map[Px][Py] = div;
  console.log(Px, Py);
}

document.addEventListener('keydown', function (event) {
  const keyActions = {}

  ;['W', 'Ц', 'w', 'ц'].forEach((key) => {
    keyActions[key] = moveUp
  })
  ;['S', 's', 'Ы', 'ы'].forEach((key) => {
    keyActions[key] = moveDown
  })
  ;['A', 'a', 'Ф', 'ф'].forEach((key) => {
    keyActions[key] = moveRight
  })
  ;['D', 'd', 'В', 'в'].forEach((key) => {
    keyActions[key] = moveLeft
  })

  const action = keyActions[event.key]
  if (action) {
    action()
  }
})
function moveUp() {
  if (isFieldTile(Px - 1, Py)) {
    movePerson(Px - 1, Py);
  }
}

function moveDown() {
  if (isFieldTile(Px + 1, Py)) {
    movePerson(Px + 1, Py);
  }
}

function moveLeft() {
  if (isFieldTile(Px, Py + 1)) {
    movePerson(Px, Py + 1);
  }
}

function moveRight() {
  if (isFieldTile(Px, Py - 1)) {
    movePerson(Px, Py - 1);
  }
}

function getRandomPosition(limit) {
  return Math.floor(Math.random() * limit);
}

function isFieldTile(x, y) {
  return map[x][y].classList.value === 'field tile';
}

function movePerson(newPx, newPy) {
  const person = document.querySelector('.tileP');
  person.classList.remove('tileP');

  Px = newPx;
  Py = newPy;

  const div = createDiv(['field', 'tile', 'tileP'], Px, Py);
  map[Px][Py] = div;
}

drawPerson()

drowRoad()

drowItems()

drowWarior(10)
// console.log(map)
