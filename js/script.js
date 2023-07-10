const rows = 24
const columns = 40
const tileSize = 25
let attackPower = 25
const field = document.querySelector('.field')
let map = []
let y = Random(columns)
let x = Random(rows)
const directions = [
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: +1, dy: 0 },
]

function createDiv(classNames, top, left, health) {
  const div = document.createElement('div')
  div.classList.add(...classNames)
  div.style.top = top * tileSize + 'px'
  div.style.left = left * tileSize + 'px'
  if (health) {
    div.style.width = health + '%'
  }
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

function drawRoad() {
  function Roadraw() {
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
  Roadraw()
}

function drawItems() {
  function drawTileSW(count) {
    if (count > 0) {
      let x, y
      do {
        y = Random(columns)
        x = Random(rows)
      } while (!isFieldTile(x, y))
      console.log(map[x][y])
      map[x][y].classList.add('tileSW')
      count--
      drawTileSW(count)
    }
  }

  function drawTileHP(count) {
    if (count > 0) {
      let x, y
      do {
        y = Random(columns)
        x = Random(rows)
      } while (!isFieldTile(x, y))
      map[x][y].classList.add('tileHP')
      count--
      drawTileHP(count)
    }
  }

  drawTileHP(10)
  drawTileSW(2)
}

function drawWarrior(count) {
  if (count > 0) {
    let x, y
    do {
      y = Random(columns)
      x = Random(rows)
    } while (!isFieldTile(x, y))

    let div = createDiv(['field', 'tile', 'tileE'], x, y)
    const health = createDiv(['health'], 0, 0, 100)
    div.appendChild(health)
    map[x][y] = div
    count--

    moveWarrior(x, y)
    drawWarrior(count)
  }
}

function moveWarrior(x, y) {
  let attackPower = 25
  let timer
  timer = setInterval(function () {
    if (!map[x][y].classList.contains('tileE')) {
      return clearInterval(timer)
    }
    let randomIndex = Math.floor(Math.random() * directions.length)
    let newX = x + directions[randomIndex].dx
    let newY = y + directions[randomIndex].dy

    if (isFieldTile(newX, newY)) {
      let oldHealthWarrior = map[x][y].children[0].style.width
      let div = createDiv(['field', 'tile', 'tileE'], newX, newY)
      let health = createDiv(['health'], 0, 0)
      health.style.width = oldHealthWarrior
      div.appendChild(health)
      map[newX][newY] = div

      map[x][y].innerHTML = ''
      map[x][y].classList.remove('tileE')

      x = newX
      y = newY
      attack(x, y)
    }
  }, 500)
}

function drawPerson() {
  while (!isFieldTile(x, y)) {
    y = Random(columns)
    x = Random(rows)
  }
  const div = createDiv(['field', 'tile', 'tileP'], x, y)
  const health = createDiv(['health'], 0, 0, 100)
  div.appendChild(health)
  map[x][y] = div
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
  keyActions[' '] = attack

  const action = keyActions[event.key]
  if (action) {
    action(x, y)
  }
})

function attack(x, y) {
  let attacking = map[x][y]
  for (let direction of directions) {
    let nX = x + direction.dx
    let nY = y + direction.dy
    // console.log(nY, nX, map[nX][nY])
    if (
      nX >= 0 &&
      nY >= 0 &&
      nX < rows &&
      nY < columns &&
      map[nX][nY].children.length
    ) {
      let enemy = map[nX][nY]
      if (enemy.classList.value !== attacking.classList.value) {
        // console.log(
        //   'атакуемый',
        //   enemy.classList.value,
        //   'атакующий',
        //   attacking.classList.value
        // )
        let previousHealth = parseFloat(enemy.children[0].style.width)
        enemy.children[0].style.width = previousHealth - attackPower + '%'
        if (previousHealth - attackPower <= 0) {
          enemy.innerHTML = ''
          enemy.classList.remove('tileE')
          enemy.classList.remove('tileP')
        }
      }
    }
  }
}

function moveUp() {
  if (isFieldTile(x - 1, y)) {
    movePerson(x - 1, y)
  }
}

function moveDown() {
  if (isFieldTile(x + 1, y)) {
    movePerson(x + 1, y)
  }
}

function moveLeft() {
  if (isFieldTile(x, y + 1)) {
    movePerson(x, y + 1)
  }
}

function moveRight() {
  if (isFieldTile(x, y - 1)) {
    movePerson(x, y - 1)
  }
}

// function getRandomposition() {
//   let y = Random(columns)
//   let x = Random(rows)
//   while (!isFieldTile(x, y)) {
//     y = Random(columns)
//     x = Random(rows)
//   }
//   return x, y
// }

function Random(limit) {
  return Math.floor(Math.random() * limit)
}

function isFieldTile(x, y) {
  return (
    x >= 0 &&
    y >= 0 &&
    x < rows &&
    y < columns &&
    !map[x][y].classList.contains('tileE') &&
    !map[x][y].classList.contains('tileW') &&
    !map[x][y].classList.contains('tileP')
    // !map[x][y].classList.value !== 'field tile tileE'
  )
}

function movePerson(newx, newy) {
  const person = document.querySelector('.tileP')
  let oldHealthPerson = parseFloat(person.children[0].style.width)
  person.innerHTML = ''
  person.classList.remove('tileP')
  console.log(map[newx][newy], oldHealthPerson)
  if (map[newx][newy].classList.contains('tileHP') && oldHealthPerson < 100) {
    oldHealthPerson = oldHealthPerson + 25
    map[newx][newy].classList.remove('tileHP')
  }
  // if (map[newx][newy].classList.contains('tileSW')) {
  // let attackPower = attackPower * 2
  //   map[newx][newy].classList.remove('tileSW')
  // }
  x = newx
  y = newy

  const div = createDiv(['field', 'tile', 'tileP'], x, y)
  const health = createDiv(['health'], 0, 0, oldHealthPerson)
  div.appendChild(health)

  map[x][y] = div
}

drawMap()
drawRoom()
drawPerson()
drawRoad()
drawItems()
drawWarrior(10)
