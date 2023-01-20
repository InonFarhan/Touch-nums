'use strict'

const WIN_SOUND = new Audio('sound/win.mp3')
const LOSE_SOUND = new Audio('sound/game over.mp3')
const POP_SOUND = new Audio('sound/pop.mp3')

var isPlay
var isSilent
var isVictory

var gNumLevel = 25
var gGameSpeed = 35
var gSpeed
var gCounter
var gCurrNum
var gNums
var gBoard
var gGameTimeInterval

function initGame() {
    gSpeed = gGameSpeed
    isVictory = false
    isSilent = false
    isPlay = true
    gCurrNum = 1
    gCounter = 0
    gNums = createNumsArr(gNumLevel)
    gBoard = createBoard(gNumLevel)
    randerBoard(gBoard)
    changeHtml('.call', gCurrNum)
    changeHtml('.call2', gCurrNum)
    showForSec('.look1')
    showForSec('.look2')
    gGameTimeInterval = setInterval(() => {
        if (gSpeed < 0.001) gameOver()
        changeHtml('.time', gSpeed.toFixed(3))
        gSpeed -= 0.01
    }, 10)
}

function cellClicked(clickedNum) {
    if (clickedNum.innerHTML.includes(gCurrNum)) {
        if (!isSilent) POP_SOUND.play()
        clickedNum.innerHTML = ''
        gCurrNum++
        showForSec('.look1')
        showForSec('.look2')
        changeHtml('.call', gCurrNum)
        changeHtml('.call2', gCurrNum)
        if (checkIfVictory()) {
            isVictory = true
            gameOver()
        }
    }
}

function setLevel(level) {
    gCounter++
    if (gCounter < 2) return

    if (level === '1') {
        gNumLevel = 25
        gGameSpeed = 35
    }
    else if (level === '2') {
        gNumLevel = 36
        gGameSpeed = 55
    }
    gCounter = 0
    restart()
}

function restart() {
    isPlay = false
    changeHtml('.bless', '')
    clearInterval(gGameTimeInterval)
    changeHtml('.pause', 'Pause')
    initGame()
}

function gameOver() {
    clearInterval(gGameTimeInterval)
    if (isVictory) {
        if (!isSilent) WIN_SOUND.play()
        changeHtml('.bless', 'You win!')
    } else {
        if (!isSilent) LOSE_SOUND.play()
        changeHtml('.bless', 'You lose...')
    }
}

function checkIfVictory() {
    if (gCurrNum > gNumLevel) return true
    return false
}

function showForSec(cell) {
    changeoOpacity(cell, '1')
    setTimeout(changeoOpacity, 500, cell, '0')
}

function randerBoard(board) {
    var strHtml = ``
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            strHtml += `<td onclick = "cellClicked(this)" > ${board[i][j]}</td > `
        }
        strHtml += `</tr > `
    }
    changeHtml('.board', strHtml)
    return strHtml
}

function changeoOpacity(cell, value) {
    document.querySelector(cell).style.opacity = value
}

function changeHtml(cell, value) {
    document.querySelector(cell).innerHTML = value
}

function createBoard(level) {
    var board = []
    for (var i = 0; i < Math.sqrt(level); i++) {
        board[i] = []
        for (var j = 0; j < Math.sqrt(level); j++) {
            board[i][j] = getNum()
        }
    }
    return board
}

function getNum() {
    var idx = (getRandomInt(0, gNums.length))
    var currNum = gNums[idx]
    gNums.splice(idx, 1)
    return currNum
}

function createNumsArr(num) {
    var nums = []
    for (var i = 1; i <= num; i++) {
        nums.push(i)
    }
    return nums
}

function silent() {
    if (!isSilent) {
        isSilent = true
        changeHtml('.silent', '&#128263')
    }
    else {
        isSilent = false
        changeHtml('.silent', '&#128266')
    }
}

function pause() {
    if (isPlay) {
        isPlay = false
        changeHtml('.pause', 'Play')
        clearInterval(gGameTimeInterval)
    }
    else {
        isPlay = true
        changeHtml('.pause', 'Pause')
        gGameTimeInterval = setInterval(() => {
            if (gSpeed < 0.001) gameOver()
            changeHtml('.time', gSpeed.toFixed(3))
            gSpeed -= 0.01
        }, 10)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}