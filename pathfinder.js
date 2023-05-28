const algorithmFunctions = {
    'dfs': (stackOrQueue) => stackOrQueue.pop(),
    'bfs': (stackOrQueue) => stackOrQueue.shift()
}

const checks = [
    (x, y) => x != 0 && board[y][x - 1] != 'gray',
    (x, y) => x != size - 1 && board[y][x + 1] != 'gray',
    (x, y) => y != size - 1 && board[y + 1][x] != 'gray',
    (x, y) => y != 0 && board[y - 1][x] != 'gray'
]

const goalButton = document.querySelector('#goal')
const recolourEventCallbacks = []
const removeEventCallbacks = []
const sizeInput = document.querySelector('#size')
const startButton = document.querySelector('#start')        

let board
let goal
let size
let start
let type = 'gray'

sizeInput.addEventListener('change', () => {
    goal = undefined
    size = parseInt(sizeInput.value)
    start = undefined
    canvas.innerHTML = ''
    startButton.style.backgroundColor = goalButton.style.backgroundColor = 'var(--dark)'
        
    board = Array.from({ length: size }, () => Array(size).fill('blank'))

    for (let i = 0; i < size ** 2; i++) {
        const square = document.createElement('div')
        recolourEventCallbacks[i] = recolour.bind(null, i)
        square.addEventListener("click", recolourEventCallbacks[i], false)
        square.setAttribute('id', `square${i}`)
        square.setAttribute('onmouseover', "this.style.cursor='pointer'")
        square.setAttribute('onmouseout', "this.style.cursor='default'")
        square.style.height = square.style.width = `calc(${48 / size}vw - 1px)`
        document.querySelector('#canvas').appendChild(square)
    }
})

startButton.addEventListener('click', () => {
    if (!start) {
        type = 'red'
    }
})

goalButton.addEventListener('click', () => {
    if (!goal) {
        type = 'blue' 
    }
})

document.querySelector('#dfs').addEventListener('click', () => { 
    calculate('dfs') 
})

document.querySelector('#bfs').addEventListener('click', () => { 
    calculate('bfs') 
})

function recolour(index) {
    // working with html classes to change the colour of the squares
    if (type == 'red') {
        start = index
        startButton.style.backgroundColor = 'var(--light)'
    }

    else if (type == 'blue') {
        goal = index
        goalButton.style.backgroundColor = 'var(--light)'
    }

    const square = document.querySelector(`#square${index}`)
    removeEventCallbacks[index] = remove.bind(null, square)
    square.addEventListener("click", removeEventCallbacks[index], false)
    square.removeEventListener("click", recolourEventCallbacks[index], false)
    square.className = ''
    square.classList.add(type)
    board[Math.floor(index / size)][index % size] = type
    type = 'gray'
}

function remove(square, type) {
    const index = parseInt(square.id.slice(6))
    recolourEventCallbacks[index] = recolour.bind(null, index)
    board[Math.floor(index / size)][index % size] = 'blank'
    square.addEventListener("click", recolourEventCallbacks[index], false)
    square.removeEventListener("click", removeEventCallbacks[index], false)
    square.className = ''

    if (type == 'red') {
        start = undefined
        startButton.style.backgroundColor = 'var(--dark)'
    }

    else if (type == 'blue') {
        goal = undefined
        goalButton.style.backgroundColor = 'var(--dark)'
    }
}

function calculate(algorithm) {
    if (start && goal) {
        const adjacencyMatrix = Array.from({ length: size ** 2 }, () => Array(size ** 2).fill(0))
        const visited = Array(size ** 2).fill(false)
              visited[start] = true
        const path = []
        const stackOrQueue = [start]
        let current

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                document.querySelector(`#square${y * size + x}`).classList.remove('green')

                if (board[y][x] != 'gray') {
                    const adjacencies = []

                    // check for adjacent squares in all directions and add to adjacency matrix
                    for (let i = 0; i < 4; i++) {
                        if (checks[i](x, y)) {
                            adjacencies.push([y * size + x, y * size + x + (i == 0 ? -1 : i == 1 ? 1 : i == 2 ? size : -size)])
                        }
                    }

                    // fill out the adjacency matrix
                    adjacencies.forEach(([a, b]) => {
                        adjacencyMatrix[a][b] = 1
                        adjacencyMatrix[b][a] = 1
                    })
                }
            }
        }

        // dfs or bfs
        while (stackOrQueue.length != 0) {
            current = algorithmFunctions[algorithm](stackOrQueue)
            path.push(current)

            if (current == goal) {
                return path // not used
            }

            else if (current != start) {
                document.querySelector(`#square${current}`).classList.add('green')
            }

            for (let i = 0; i < size ** 2; i++) {
                if (adjacencyMatrix[current][i] == 1 && visited[i] == false) {
                    stackOrQueue.push(i)
                    visited[i] = true
                }
            }
        }
    }
}
