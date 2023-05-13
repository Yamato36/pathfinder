const canvas = document.querySelector('#canvas')
const calculateButton = document.querySelector('#calculate')
const goalButton = document.querySelector('#goal')
const searchInput = document.querySelector('#search')
const sizeInput = document.querySelector('#size')
const startButton = document.querySelector('#start')

let board
let goal
let goalPlaced = false
let overwrite = false
let size
let sizeSquared
let start
let startPlaced = false
let type = 1

setup()

function setup() {
    sizeInput.addEventListener('change', () => {
        size = sizeInput.value
        sizeSquared = size ** 2
        reset()
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

    calculateButton.addEventListener('click', () => { 
        if (startPlaced == true && goalPlaced == true || searchInput.value != '') {
            calculate(searchInput.value)
        }
    })
}

function reset() {
    if (overwrite == true) {
        canvas.innerHTML = ''
    }

    size = parseInt(sizeInput.value)
    board = Array(size).fill(Array(size).fill(0))
    
    for (let i = 0; i < size ** 2; i++) {
        const square = document.createElement('div')
        square.setAttribute('class', `squares`)
        square.setAttribute('id', `square${i}`)
        square.setAttribute('onmouseover', "this.style.cursor='pointer'")
        square.setAttribute('onmouseout', "this.style.cursor='default'")
        square.addEventListener("click", recolour.bind(null, i), false)
        square.style.height = `calc(${92.5 / size}vh - 1px)`;
        square.style.width = `calc(${92.5 / size}vh - 1px)`;
        canvas.appendChild(square)
    }

    goalPlaced = false
    overwrite = true
    startPlaced = false
}

function recolour(index) {
    console.log(board)

    const square = document.querySelector(`#square${index}`)
    square.classList.remove('blank')

    if (type == 1) {
        square.classList.add('gray')
    }

    else if (type == 2) {
        start = index
        startPlaced = true
        square.classList.add('red')
        startButton.style.backgroundColor = 'rgb(193, 195, 206)';
    }   

    else if (type == 3) {
        goal = index
        goalPlaced = true
        square.classList.add('blue')
        goalButton.style.backgroundColor = 'rgb(193, 195, 206)';
    }

    square.addEventListener('click', () => {
        square.removeEventListener("click", recolour.bind(null, index), false);

        if (square.classList.contains('red')) {
            startPlaced = false
            startButton.style.backgroundColor = 'rgb(255, 255, 255)';
        }

        else if (square.classList.contains('blue')) {
            goalPlaced = false
            goalButton.style.backgroundColor = 'rgb(255, 255, 255)';
        }
        
        square.className = ''
        square.classList.add('blank')
        board[Math.floor(index / size)][index % size] = 0
        square.addEventListener("click", recolour.bind(null, index), false);
    }, {once: true})

    board[Math.floor(index / size)][index % size] = type
    type = 1
}

function calculate(algorithm) {
    let adjacencyMatrix = Array(sizeSquared).fill(Array(sizeSquared).fill(0))
    goalPlaced = false
    startPlaced = false

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            document.querySelector(`#square${y * size + x}`).classList.remove('green')

            if (board[y][x] != 1) {
                if (x != 0 && board[y][x - 1] != 1) {
                    adjacencyMatrix[y * size + x][y * size + x - 1] = 1
                    adjacencyMatrix[y*size + x - 1][y*size + x] = 1
                }

                if (x != size - 1 && board[y][x + 1] != 1) {
                    adjacencyMatrix[y * size + x][y * size + x + 1] = 1
                    adjacencyMatrix[y * size + x + 1][y * size + x] = 1
                }

                if (y != 0 && board[y - 1][x] != 1) {
                    adjacencyMatrix[y * size + x][(y - 1) * size + x] = 1
                    adjacencyMatrix[(y - 1) * size + x][y * size + x] = 1
                }

                if (y != size - 1 && board[y + 1][x] != 1) {
                    adjacencyMatrix[y * size + x][(y + 1) * size + x] = 1
                    adjacencyMatrix[(y + 1) * size + x][y * size + x] = 1
                }
            }

            console.log('adjacent squares')
        }
    }

    console.log(start)
    console.log(goal)
    console.log(board)

    switch (algorithm) {
        case 'dfs':
            dfs_bfs('dfs', adjacencyMatrix)
            break

        case 'bfs':
            dfs_bfs('bfs', adjacencyMatrix)
            break
    }
}

function dfs_bfs(computeOrder, adjacencyMatrix) {
    let current
    let path = []
    let stackOrQueue = []
    let visited = []

    for (let i = 0; i < size ** 2; i++) {
        visited[i] = false
    }

    stackOrQueue.push(start)
    visited[start] = true

    while (stackOrQueue.length != 0) {
        switch (computeOrder) {
            case 'dfs':
                current = stackOrQueue.pop()
                break
            
            case 'bfs':
                current = stackOrQueue.shift()
                break
        }
        
        path.push(current)
        document.querySelector(`#square${current}`).classList.add('green')

        if (current == goal) {
            break
        }

        for (let i = 0; i < size ** 2; i++) {
            if (adjacencyMatrix[current][i] == 1 && visited[i] == false) {
                stackOrQueue.push(i)
                visited[i] = true
            }
        }
    }

    console.log(`path with ${computeOrder}: ${path}`)
}
