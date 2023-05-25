// initiate variables and constants
const goalButton = document.querySelector('#goal')
const recolourEventCallbacks = []
const removeEventCallbacks = []
const sizeInput = document.querySelector('#size')
const startButton = document.querySelector('#start')

let board
let goal
let size
let start
let type = 1

// set up buttons and their validities
sizeInput.addEventListener('change', () => {
    board = []
    goal = undefined
    size = parseInt(sizeInput.value)
    start = undefined
    canvas.innerHTML = ''
    startButton.style.backgroundColor = 'rgb(42, 42, 42)'
    goalButton.style.backgroundColor = 'rgb(42, 42, 42)'

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
            square.style.height = `calc(${56 / size}vw - 1px)`
            square.style.width = `calc(${56 / size}vw - 1px)`
            document.querySelector('#canvas').appendChild(square)
        }
    }
})

startButton.addEventListener('click', () => {
    if (start == undefined) {
        type = 2
    }
})

goalButton.addEventListener('click', () => { 
    if (goal == undefined) {
        type = 3
    }
})

document.querySelector('#dfs').addEventListener('click', () => { 
    calculate('dfs')
})

document.querySelector('#bfs').addEventListener('click', () => { 
    calculate('bfs')
})

function recolour(index) {
    const square = document.querySelector(`#square${index}`)
    let colour = 'gray'

    // working with html classes to change the colour of the squares
    if (type == 2) {
        start = index
        colour = 'red'
        startButton.style.backgroundColor = 'rgb(69, 69, 69)'
    }

    else if (type == 3) {
        goal = index
        colour = 'blue'
        goalButton.style.backgroundColor = 'rgb(69, 69, 69)'
    }

    board[Math.floor(index / size)][index % size] = type
    type = 1
    removeEventCallbacks[index] = remove.bind(null, square)
    square.addEventListener("click", removeEventCallbacks[index], false)
    square.removeEventListener("click", recolourEventCallbacks[index], false)
    square.className = ''
    square.classList.add(colour)
}

function remove(square) {
    // remove the square from the board
    const index = parseInt(square.id.slice(6))
    recolourEventCallbacks[index] = recolour.bind(null, index)
    board[Math.floor(index / size)][index % size] = 0
    square.addEventListener("click", recolourEventCallbacks[index], false)
    square.removeEventListener("click", removeEventCallbacks[index], false)
    square.className = ''

    if (square.classList.contains('red')) {
        start = undefined
        startButton.style.backgroundColor = 'rgb(42, 42, 42)'
    }

    else if (square.classList.contains('blue')) {
        goal = undefined
        goalButton.style.backgroundColor = 'rgb(42, 42, 42)'
    }
}

function calculate(algorithm) {
    if (start != undefined && goal != undefined) {
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

        let adjacencies
        let adjacencyMatrix = []
        let current
        let path = []
        let stackOrQueue = [start]
        let visited = []
        
        for (let i = 0; i < size ** 2; i++) {
            adjacencyMatrix[i] = []
            visited[i] = false

            for (let j = 0; j < size ** 2; j++) {
                adjacencyMatrix[i][j] = 0
            }
        }

        visited[start] = true

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
}
