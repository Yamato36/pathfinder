const canvas = document.querySelector('#canvas')
const xSize = 20
const ySize = 20
let shift = false
let board = []

document.addEventListener("keydown", (e) => {
    if (e.key == 'Shift') {
        shift = true
    }

    else {
        shift = false
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key == 'Shift') {
        shift = false
    }
})

for (let i = 0; i < ySize; i++) {
    board[i] = []

    for (let j = 0; j < xSize; j++) {
        board[i][j] = 0
    }
}

for (let i = 0; i < xSize * ySize; i++) {
    const square = document.createElement('div')
    square.setAttribute('id', `square${i}`)
    square.setAttribute('onmouseover', "this.style.cursor='pointer'")
    square.setAttribute('onmouseout', "this.style.cursor='default'")
    square.addEventListener("click", recolour.bind(null, i), false)
    canvas.appendChild(square)
}

function recolour(index) {
    const square = document.querySelector(`#square${index}`)
    square.classList.remove('blank')

    if (shift == true) {
        square.classList.add('blue')
        updateGameBoard(index, 'pin')
    }   

    else {
        square.classList.add('red')
        updateGameBoard(index, 'wall')
    }

    square.addEventListener('click', () => { 
        square.className = ''
        square.classList.add('blank')
        square.addEventListener("click", recolour.bind(null, index), false);
    }, {once: true})    
}

function updateGameBoard(index, type) {
    let x = Math.floor(index * 0.1)
    let y = index % xSize

    switch (type) {
        case 'path':
            board[y][x] = 0

        case 'wall':
            board[y][x] = 1

        case 'pin':
            board[y][x] = 2
    }

    console.log(board)
}
