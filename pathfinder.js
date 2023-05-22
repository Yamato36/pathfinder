
/*           TO DO:
    - add maze generation?
*/

// initiate variables and constants
const canvas = document.querySelector('#canvas')
const bfsButton = document.querySelector('#bfs')
const dfsButton = document.querySelector('#dfs')
const goalButton = document.querySelector('#goal')
const sizeInput = document.querySelector('#size')
const startButton = document.querySelector('#start')
const recolourEventCallbacks = []
const removeEventCallbacks = []

let adjacencyMatrix = []
let board = []
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
    // set up buttons and their validities
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

    dfsButton.addEventListener('click', () => { 
        if (startPlaced == true && goalPlaced == true) {
            calculate('dfs')
        }
    })

    bfsButton.addEventListener('click', () => { 
        if (startPlaced == true && goalPlaced == true) {
            calculate('bfs')
        }
    })
}

function reset() {
    board = []
    goalPlaced = false
    overwrite = true
    size = parseInt(sizeInput.value)
    sizeSquared = size ** 2
    startPlaced = false

    // if the board is being overwritten, clear the canvas
    if (overwrite == true) {
        canvas.innerHTML = ''
    }

    // create the board
    for (let i = 0; i < size; i++) {
        board[i] = []

        for (let j = 0; j < size; j++) {
            board[i][j] = 0
        }
    }
    
    // create the squares on the canvas
    for (let i = 0; i < size ** 2; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', `square${i}`)
        square.setAttribute('onmouseover', "this.style.cursor='pointer'")
        square.setAttribute('onmouseout', "this.style.cursor='default'")
        square.style.height = `calc(${92.5 / size}vh - 1px)`;
        square.style.width = `calc(${92.5 / size}vh - 1px)`;
        recolourEventCallbacks[i] = recolour.bind(null, i);
        square.addEventListener("click", recolourEventCallbacks[i], false)
        canvas.appendChild(square)
    }
}

function recolour(index) {
    // working with html classes to change the colour of the squares
    const square = document.querySelector(`#square${index}`)
    square.className = ''

    switch (type) {
        case 1:
            // if square is clicked normally, set to wall=
            square.classList.add('gray')
            board[Math.floor(index / size)][index % size] = 1
            break;

        // if square is clicked while start or goal is selected, set to start or goal
        case 2:
            start = index
            startPlaced = true
            board[Math.floor(index / size)][index % size] = 2
            square.classList.add('red')
            startButton.style.backgroundColor = 'rgb(193, 195, 206)';
            break;

        case 3:
            goal = index
            goalPlaced = true
            board[Math.floor(index / size)][index % size] = 3
            square.classList.add('blue')
            goalButton.style.backgroundColor = 'rgb(193, 195, 206)';
            break;
    }

    removeEventCallbacks[index] = remove.bind(null, square);
    square.addEventListener("click", removeEventCallbacks[index], false)
    square.removeEventListener("click", recolourEventCallbacks[index], false);
    
    type = 1
}

function remove(square) {
    // remove the square from the board
    const index = parseInt(square.id.slice(6))

    if (square.classList.contains('red')) {
        startPlaced = false
        startButton.style.backgroundColor = 'rgb(255, 255, 255)';
    }

    else if (square.classList.contains('blue')) {
        goalPlaced = false
        goalButton.style.backgroundColor = 'rgb(255, 255, 255)';
    }

    board[Math.floor(index / size)][index % size] = 0
    recolourEventCallbacks[index] = recolour.bind(null, index);
    square.addEventListener("click", recolourEventCallbacks[index], false)
    square.removeEventListener("click", removeEventCallbacks[index], false);
    square.className = ''
}

function calculate(algorithm) {
    adjacencyMatrix = []

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

    // run chosen algorithm
    switch (algorithm) {
        case 'dfs':
            dfs_bfs('dfs', adjacencyMatrix)
            break

        case 'bfs':
            dfs_bfs('bfs', adjacencyMatrix)
            break
    }
}

// depth first search and breadth first search combined for simplicity
function dfs_bfs(computeOrder, adjacencyMatrix) {
    // initialise variables and arrays
    let current
    let path = []
    let stackOrQueue = []
    let visited = []

    for (let i = 0; i < size ** 2; i++) {
        visited[i] = false
    }

    stackOrQueue.push(start)
    visited[start] = true

    // different order of computation depending on algorithm
    while (stackOrQueue.length != 0) {
        switch (computeOrder) {
            case 'dfs':
                current = stackOrQueue.pop()
                break
            
            case 'bfs':
                current = stackOrQueue.shift()
                break
        }
        
        // add to path and check if goal has been reached
        path.push(current)

        if (current == goal) {
            break
        }

        // visualise the path
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

    console.log(`path with ${computeOrder}: ${path}`)
}
