// initiate variables and constants
const canvas = document.querySelector('#canvas')
const bfsButton = document.querySelector('#bfs')
const dfsButton = document.querySelector('#dfs')
const goalButton = document.querySelector('#goal')
const sizeInput = document.querySelector('#size')
const startButton = document.querySelector('#start')
const recolourEventCallbacks = []
const removeEventCallbacks = []

const algorithmFunctions = {
    'dfs': (stackOrQueue) => stackOrQueue.pop(),
    'bfs': (stackOrQueue) => stackOrQueue.shift()
}

const checks = [
    (x, y) => x != 0 && board[y][x - 1] != 1,
    (x, y) => x != size - 1 && board[y][x + 1] != 1,
    (x, y) => y != size - 1 && board[y + 1][x] != 1,
    (x, y) => y != 0 && board[y - 1][x] != 1
]

let adjacencyMatrix = []
let algorithm
let board = []
let goal
let goalPlaced = false
let size
let sizeSquared
let start
let startPlaced = false
let type = 1

// set up buttons and their validities
sizeInput.addEventListener('change', () => {
    board = []
    goalPlaced = false
    size = parseInt(sizeInput.value)
    sizeSquared = size ** 2
    startPlaced = false
    canvas.innerHTML = ''

    // create the board
    for (let i = 0; i < size; i++) {
        board[i] = []

        for (let j = 0; j < size; j++) {
            board[i][j] = 0

            k = i * size + j
            // create the squares on the canvas
            const square = document.createElement('div')
            recolourEventCallbacks[k] = recolour.bind(null, k)
            square.addEventListener("click", recolourEventCallbacks[k], false)
            square.setAttribute('id', `square${k}`)
            square.setAttribute('onmouseover', "this.style.cursor='pointer'")
            square.setAttribute('onmouseout', "this.style.cursor='default'")
            square.style.height = `calc(${92.5 / size}vh - 1px)`
            square.style.width = `calc(${92.5 / size}vh - 1px)`
            canvas.appendChild(square)
        }
    }

    startButton.style.backgroundColor = 'rgb(42, 42, 42)'
    goalButton.style.backgroundColor = 'rgb(42, 42, 42)'
})

startButton.addEventListener('click', () => {
    if (startPlaced == false) {
        type = 2
    }
})

goalButton.addEventListener('click', () => { 
    if (goalPlaced == false) {
        type = 3
    }
})

dfsButton.addEventListener('click', () => { 
    if (startPlaced == true && goalPlaced == true) {
        algorithm = 'dfs'
        calculate()
    }
})

bfsButton.addEventListener('click', () => { 
    if (startPlaced == true && goalPlaced == true) {
        algorithm = 'bfs'
        calculate()
    }
})

function recolour(index) {
    // working with html classes to change the colour of the squares
    const square = document.querySelector(`#square${index}`)
    board[Math.floor(index / size)][index % size] = type
    removeEventCallbacks[index] = remove.bind(null, square)
    square.addEventListener("click", removeEventCallbacks[index], false)
    square.removeEventListener("click", recolourEventCallbacks[index], false)
    square.className = ''
    
    // set the square to type
    switch (type) {
        case 1:
            square.classList.add('gray')
            break;

        case 2:
            start = index
            startPlaced = true
            square.classList.add('red')
            startButton.style.backgroundColor = 'rgb(69, 69, 69)'
            break;

        case 3:
            goal = index
            goalPlaced = true
            square.classList.add('blue')
            goalButton.style.backgroundColor = 'rgb(69, 69, 69)'
            break;
    }

    type = 1
}

function remove(square) {
    // remove the square from the board
    const index = parseInt(square.id.slice(6))
    board[Math.floor(index / size)][index % size] = 0
    recolourEventCallbacks[index] = recolour.bind(null, index)
    square.addEventListener("click", recolourEventCallbacks[index], false)
    square.removeEventListener("click", removeEventCallbacks[index], false)
    square.className = ''

    if (square.classList.contains('red')) {
        startPlaced = false
        startButton.style.backgroundColor = 'rgb(42, 42, 42)'
    }

    else if (square.classList.contains('blue')) {
        goalPlaced = false
        goalButton.style.backgroundColor = 'rgb(42, 42, 42)'
    }
}

function calculate() {
    adjacencyMatrix = []
    let current
    let path = []
    let stackOrQueue = []
    let visited = []

    // create the adjacency matrix
    for (let i = 0; i < size ** 2; i++) {
        adjacencyMatrix[i] = []

        for (let j = 0; j < size ** 2; j++) {
            adjacencyMatrix[i][j] = 0
        }
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            document.querySelector(`#square${y * size + x}`).classList.remove('green')

            // check for adjacent squares in all directions and add to adjacency matrix
            if (board[y][x] != 1) {
                adjacencies = []

                for (let i = 0; i < 4; i++) {
                    if (checks[i](x, y)) {
                        adjacencies.push([y * size + x, y * size + x + (i == 0 ? -1 : i == 1 ? 1 : i == 2 ? size : -size)])
                    }
                }

                // fill out the adjacency matrix
                while (adjacencies != 0) {
                    adjacencyMatrix[adjacencies[0][0]][adjacencies[0][1]] = 1
                    adjacencyMatrix[adjacencies[0][1]][adjacencies[0][0]] = 1
                    adjacencies.shift()
                }
            }
        }
    }

    // run chosen algorithm
    for (let i = 0; i < size ** 2; i++) {
        visited[i] = false
    }

    stackOrQueue.push(start)
    visited[start] = true

    // different order of computation depending on algorithm
    while (stackOrQueue.length != 0) {
        current = algorithmFunctions[algorithm](stackOrQueue)
        path.push(current)

        if (current == goal) {
            break
        }

        else if (current != start) {
            document.querySelector(`#square${current}`).classList.add('green')
        }

        // add adjacent squares to stack or queue
        for (let i = 0; i < size ** 2; i++) {
            if (adjacencyMatrix[current][i] == 1 && visited[i] == false) {
                stackOrQueue.push(i)
                visited[i] = true
            }
        }
    }
}
