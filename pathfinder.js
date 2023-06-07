const checks = [
    (x, y) => x != 0 && board[y][x - 1] != 'gray',
    (x, y) => x != size - 1 && board[y][x + 1] != 'gray',
    (x, y) => y != size - 1 && board[y + 1][x] != 'gray',
    (x, y) => y != 0 && board[y - 1][x] != 'gray'
]

const colours = {
    'red': 'rgb(190, 65, 65)',
    'blue': 'rgb(74, 74, 139)',
    'gray': 'rgb(160, 160, 160)'
}

const goalButton = document.querySelector('#goal')
const recolourEventCallbacks = []
const removeEventCallbacks = []
const sizeInput = document.querySelector('#size')
const startButton = document.querySelector('#start') 

let board, goal, size, start;
let type = 'gray'

sizeInput.addEventListener('change', () => {
    canvas.innerHTML = ''
    goal = undefined
    size = parseInt(sizeInput.value)
    start = undefined
    startButton.style.backgroundColor = goalButton.style.backgroundColor = 'var(--dark)'
    board = Array.from({ length: size }, () => Array(size).fill(undefined))

    for (let index = 0; index < size ** 2; index++) {
        const square = document.createElement('div')
        recolourEventCallbacks[index] = recolour.bind(null, index, square)
        square.addEventListener("click", recolourEventCallbacks[index], false)
        square.setAttribute('id', `square${index}`)
        square.setAttribute('onmouseover', "this.style.cursor='pointer'")
        square.setAttribute('onmouseout', "this.style.cursor='default'")
        square.style.height = square.style.width = `calc(${48 / size}vw)`
        document.querySelector('#canvas').appendChild(square)
    }
})

startButton.addEventListener('click', () => {
    if (!start) type = 'red'
})

goalButton.addEventListener('click', () => {
    if (!goal) type = 'blue' 
})

document.querySelector('#dfs').addEventListener('click', () => calculate('dfs'))

document.querySelector('#bfs').addEventListener('click', () => calculate('bfs'))

function recolour(index, square) {
    if (type == 'red') { startButton.style.backgroundColor = 'var(--light)' }
    else if (type == 'blue') { goalButton.style.backgroundColor = 'var(--light)' }

    removeEventCallbacks[index] = remove.bind(null, index, square, type)
    board[Math.floor(index / size)][index % size] = type
    square.addEventListener("click", removeEventCallbacks[index], false)
    square.removeEventListener("click", recolourEventCallbacks[index], false)
    square.style.backgroundColor = colours[type]
    type == 'red' ? start = index : type == 'blue' ? goal = index : null
    type = 'gray' 
}

function remove(index, square, type) {
    if (type == 'red') { startButton.style.backgroundColor = 'var(--dark)' }
    else if (type == 'blue') { goalButton.style.backgroundColor = 'var(--dark)' }

    recolourEventCallbacks[index] = recolour.bind(null, index, square)
    board[Math.floor(index / size)][index % size] = undefined
    square.addEventListener("click", recolourEventCallbacks[index], false)
    square.removeEventListener("click", removeEventCallbacks[index], false)
    square.style.backgroundColor = ''
    type == 'red' ? start = undefined : type == 'red' ? goal = undefined : null
}

function calculate(algorithm) {
    if (start && goal) {
        const adjacencyMatrix = Array.from({ length: size ** 2 }, () => Array(size ** 2).fill(0))
        const visited = Array(size ** 2).fill(false)
              visited[start] = true
        const path = []
        const shortestPath = []
        const stackOrQueue = [start]

        let current
        let previous = path[path.length - 2]

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                document.querySelector(`#square${y * size + x}`).classList.remove('green')

                if (board[y][x] != 'gray') {
                    const adjacencies = []

                    // check for adjacent squares in all directions and add to adjacency matrix
                    for (let i = 0; i < 4; i++) {
                        if (checks[i](x, y))
                            adjacencies.push([y * size + x, y * size + x + (i == 0 ? -1 : i == 1 ? 1 : i == 2 ? size : -size)])
                    }

                    adjacencies.forEach(([a, b]) => {
                        adjacencyMatrix[a][b] = 1
                        adjacencyMatrix[b][a] = 1
                    })
                }
            }
        }

        // dfs or bfs
        while (stackOrQueue.length != 0) {
            current = algorithm == 'dfs' ? stackOrQueue.pop() : stackOrQueue.shift()
            path.push(current)

            if (current == goal) {
                previous = path[path.length - 1]
                shortestPath.push(path[path.length - 1])

                // backtracking
                for (let i = path.length - 1; i > -1; i--) {
                    if (adjacencyMatrix[path[i]][previous] == 1) {
                        shortestPath.push(path[i])
                        previous = path[i]
                        document.querySelector(`#square${path[i]}`).classList.add('green')
                    }
                }

                return shortestPath // not used
            }

            for (let i = 0; i < size ** 2; i++) {
                if (adjacencyMatrix[current][i] == 1 && visited[i] == false)
                    visited[stackOrQueue.push(i)] = true
            }
        }
    }
}
