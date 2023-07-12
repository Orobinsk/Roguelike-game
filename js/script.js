const field = document.querySelector('.field')

const rows = 24
const columns = 40
const tileSize = 25
const roomQuantity = random(5, 10)

let x, y

let map
const objects = {
  wall: { type: 'wall', class: 'tile tileW', x: 0, y: 0 },
  floor: {
    type: 'floor',
    class: 'tile',
    item: '',
    enemies: '',
    player: '',
    x: 0,
    y: 0,
  },
}
const enemies = {
  player: {
    type: 'player',
    class: 'tileP',
    x: 0,
    y: 0,
    health: 100,
    attackPower: 25,
  },
  warriors: {
    type: 'enemies',
    class: 'tileE',
    x: 0,
    y: 0,
    health: 100,
    attackPower: 25,
  },
}
const items = {
  sword: { type: 'sword', class: 'tileSW' },
  HP: { type: 'HP', class: 'tileHP' },
}

// helpers
const directions = [
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 0 },
]

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function updateMapElem(x, y, elem) {
  map[x][y] = { ...elem }
  map[x][y].x = x * tileSize
  map[x][y].y = y * tileSize
}

function updateDiv(div, elem) {
  div.innerHTML = ''
  div.className = elem.class
  if (elem.enemies) {
    div.classList.add(elem.enemies.class)
    let healthElem = document.createElement('div')
    healthElem.style.width = elem.enemies.health + '%'
    div.appendChild(healthElem)
    healthElem.classList.add('health')
  } else if (elem.item) {
    div.classList.add(elem.item.class)
  }
}

function updateMap(newElem, oldElem) {
  let newId = `${newElem.x}${newElem.y}`
  let oldId = `${oldElem.x}${oldElem.y}`
  let newTile = document.getElementById(newId)
  let oldTile = document.getElementById(oldId)
  updateDiv(newTile, newElem)
  updateDiv(oldTile, oldElem)
}

function drawMap() {
  for (let i = 0; i < rows; i++) {
    map[i].forEach((e) => {
      let elem = document.createElement('div')
      elem.className = e.class
      elem.style.top = e.x + 'px'
      elem.style.left = e.y + 'px'
      elem.id = `${e.x}${e.y}`
      if (e.item) {
        elem.classList.add(e.item.class)
      }
      if (e.enemies) {
        elem.classList.add(e.enemies.class)
        let healthElem = document.createElement('div')
        healthElem.style.width = e.enemies.health + '%'
        elem.appendChild(healthElem)
        healthElem.classList.add('health')
      }
      field.appendChild(elem)
    })
  }
}

function createMap() {
  map = new Array(rows)
  for (let i = 0; i < rows; i++) {
    map[i] = new Array(columns)
    for (let j = 0; j < columns; j++) {
      updateMapElem(i, j, objects.wall)
    }
  }
}

function createRoom() {
  for (let i = 0; i < roomQuantity; i++) {
    const roomRow = random(3, 8)
    const roomCol = random(3, 8)
    const startRow = Math.floor(Math.random() * (rows - roomRow + 1))
    const startCol = Math.floor(Math.random() * (columns - roomCol + 1))

    for (let k = startRow; k < startRow + roomRow; k++) {
      for (let j = startCol; j < startCol + roomCol; j++) {
        updateMapElem(k, j, objects.floor)
      }
    }
  }
}

function createRoad() {
  function Roadraw() {
    let RoadQuantity = random(3, 6)
    for (let i = 0; i < RoadQuantity; i++) {
      let startRow = random(0, rows - 1)
      for (let k = 0; k < columns; k++) {
        updateMapElem(startRow, k, objects.floor)
      }
    }
  }
  function RoadCol() {
    let RoadQuantity = random(3, 6)
    for (let i = 0; i < RoadQuantity; i++) {
      let startCol = random(0, columns - 1)
      for (let k = 0; k < rows; k++) {
        updateMapElem(k, startCol, objects.floor)
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
        x = random(0, rows - 1)
        y = random(0, columns - 1)
      } while (map[x][y].type === 'wall')
      map[x][y].item = Object.assign({}, items.sword)
      count--
      drawTileSW(count)
    }
  }

  function drawTileHP(count) {
    if (count > 0) {
      let x, y
      do {
        x = random(0, rows - 1)
        y = random(0, columns - 1)
      } while (!(map[x][y].type === 'floor'))
      map[x][y].item = Object.assign({}, items.HP)
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
      x = random(0, rows - 1)
      y = random(0, columns - 1)
    } while (!(map[x][y].type === 'floor'))
    map[x][y].enemies = Object.assign({}, enemies.warriors)
    map[x][y].enemies.x = x * tileSize
    map[x][y].enemies.y = y * tileSize
    count--
    moveWarrior(x, y)
    drawWarrior(count)
  }
}

function moveWarrior(x, y) {
  let timer
  timer = setInterval(function () {
    if (map[x][y].enemies.type !== 'enemies') {
      clearInterval(timer)
    } else {
      let direction = Math.floor(Math.random() * directions.length)
      let newX = x + directions[direction].dx
      let newY = y + directions[direction].dy

      if (isFloor(newX, newY)) {
        map[newX][newY].enemies = Object.assign(map[x][y].enemies)
        map[newX][newY].enemies.x = newX * tileSize
        map[newX][newY].enemies.y = newY * tileSize
        map[x][y].enemies = ''
        updateMap(map[newX][newY], map[x][y])
        x = newX
        y = newY
        attack(x, y)
      }
    }
  }, 400)
}

function drawPerson() {
  do {
    x = random(0, rows - 1)
    y = random(0, columns - 1)
  } while (!(map[x][y].type === 'floor'))

  map[x][y].enemies = Object.assign({}, enemies.player)
  map[x][y].enemies.x = x * tileSize
  map[x][y].enemies.y = y * tileSize
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
    event.preventDefault()
    action(x, y)
  }
})

function attack(x, y) {
  let attacking = map[x][y].enemies
  for (let direction of directions) {
    let nX = x + direction.dx
    let nY = y + direction.dy
    if (
      nX >= 0 &&
      nY >= 0 &&
      nX < rows &&
      nY < columns &&
      map[nX][nY].enemies
    ) {
      let enemy = map[nX][nY].enemies
      if (attacking.type !== enemy.type) {
        enemy.health = enemy.health - attacking.attackPower
        if (enemy.health <= 0) {
          map[nX][nY].enemies = ''
        }
        updateMap(map[nX][nY], map[x][y])
      }
    }
  }
}

function moveUp(x, y) {
  if (isFloor(x - 1, y)) {
    movePerson(x - 1, y, x, y)
  }
}

function moveDown(x, y) {
  if (isFloor(x + 1, y)) {
    movePerson(x + 1, y)
  }
}

function moveLeft(x, y) {
  if (isFloor(x, y + 1)) {
    movePerson(x, y + 1)
  }
}

function moveRight(x, y) {
  if (isFloor(x, y - 1)) {
    movePerson(x, y - 1)
  }
}

function isFloor(x, y) {
  return (
    x >= 0 &&
    y >= 0 &&
    x < rows &&
    y < columns &&
    map[x][y].type !== 'wall' &&
    map[x][y].enemies.type !== 'enemies' &&
    map[x][y].enemies.type !== 'player'
  )
}

function movePerson(newx, newy) {
  if (map[newx][newy].item.type === 'HP' && map[x][y].enemies.health < 100) {
    map[x][y].enemies.health = map[x][y].enemies.health + 25
    map[newx][newy].item = ''
  }
  if (map[newx][newy].item.type === 'sword') {
    map[x][y].enemies.attackPower = map[x][y].enemies.attackPower * 2
    map[newx][newy].item = ''
  }

  let player = Object.assign(map[x][y].enemies)
  map[x][y].enemies = ''

  map[newx][newy].enemies = Object.assign(player)
  map[newx][newy].enemies.x = newx * tileSize
  map[newx][newy].enemies.y = newy * tileSize

  updateMap(map[newx][newy], map[x][y])
  x = newx
  y = newy
}

createMap()
createRoom()
createRoad()
drawItems()
drawWarrior(10)
drawPerson()
drawMap()
