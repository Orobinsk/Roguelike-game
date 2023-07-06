const rows = 24
const columns = 40

const map = new Array(rows)
for (let i = 0; i < map.length; i++) {
  map[i] = new Array(columns).fill(0)
}

const field = document.querySelector('.field')

function drawMap() {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const tile = document.createElement('div')
      tile.classList.add('field')
      tile.classList.add('tile')
      if (map[i][j] === 0) {
        tile.classList.add('tileW')
      }
      tile.style.top = i * 25 + 'px'
      tile.style.left = j * 25 + 'px'

      field.appendChild(tile)
    }
  }
}

function drowRoom() {
  let RoomQuantity = Math.floor(Math.random() * (12 - 5) + 5)

  for (let i = 0; i < RoomQuantity; i++) {
    let RoomRow = Math.floor(Math.random() * (9 - 3) + 3)
    let RoomCol = Math.floor(Math.random() * (9 - 3) + 3)

    let startRow = Math.floor(Math.random() * (rows - RoomRow))
    let startCol = Math.floor(Math.random() * (columns - RoomCol))

    for (let k = startRow; k < startRow + RoomRow; k++) {
      for (let j = startCol; j < startCol + RoomCol; j++) {
        map[k][j] = 1
      }
    }
  }
}

function drowRoad() {
  function RoadRow() {
    let RoadQuantity = Math.floor(Math.random() * (6 - 3) + 3)
    for (let i = 0; i < RoadQuantity; i++) {
      let startRow = Math.floor(Math.random() * rows)
      for (let k = 0; k < columns; k++) {
        map[startRow][k] = 1
      }
    }
  }
  function RoadCol() {
    let RoadQuantity = Math.floor(Math.random() * (6 - 3) + 3)
    for (let i = 0; i < RoadQuantity; i++) {
      let startCol = Math.floor(Math.random() * columns)
      for (let k = 0; k < rows; k++) {
        map[k][startCol] = 1
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
      if (map[x][y] === 1) {
        const tileSW = document.createElement('div')
        tileSW.classList.add('field', 'tile', 'tileSW')
        tileSW.style.top = x * 25 + 'px'
        tileSW.style.left = y * 25 + 'px'
        field.appendChild(tileSW)
        count -= 1
        drowTileSW(count)
      } else drowTileSW(count)
    }
  }
  function drowTileHP(count) {
    if (count > 0) {
      let y = Math.floor(Math.random() * columns)
      let x = Math.floor(Math.random() * rows)
      if (map[x][y] === 1) {
        const tileHP = document.createElement('div')
        tileHP.classList.add('field', 'tile', 'tileHP')
        tileHP.style.top = x * 25 + 'px'
        tileHP.style.left = y * 25 + 'px'
        field.appendChild(tileHP)
        count -= 1
        drowTileHP(count)
      } else drowTileHP(count)
    }
  }
  drowTileHP(10)
  drowTileSW(2)
}

function drowPerson(Px, Py) {
  console.log(Px, Py)
  if (map[Px][Py] === 1) {
    const tileP = document.createElement('div')
    tileP.classList.add('field', 'tile', 'tileP')
    tileP.style.top = Px * 25 + 'px'
    tileP.style.left = Py * 25 + 'px'
    field.appendChild(tileP)
    return Px, Py
  } else {
    Py = Math.floor(Math.random() * columns)
    Px = Math.floor(Math.random() * rows)
    drowPerson(Px, Py)
  }
}

function drowWarior(count) {
  if (count > 0) {
    let y = Math.floor(Math.random() * columns)
    let x = Math.floor(Math.random() * rows)
    if (map[x][y] === 1) {
      const tileE = document.createElement('div')
      tileE.classList.add('field', 'tile', 'tileE')
      tileE.style.top = x * 25 + 'px'
      tileE.style.left = y * 25 + 'px'
      field.appendChild(tileE)
      count -= 1
      drowWarior(count)
    } else drowWarior(count)
  }
}

drowRoad()
drowRoom()
drowItems()

drowWarior(10)

drawMap()

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'w' || 'W':
      console.log(Px - 1, Py)

    case 'value2': // if (x === 'value2')
  }
})
let Py = Math.floor(Math.random() * columns)
let Px = Math.floor(Math.random() * rows)
drowPerson(Px, Py)
// console.log(map)
