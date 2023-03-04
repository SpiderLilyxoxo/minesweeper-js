
import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose, checkRestart} from "./logic.js";

const BOARD_SIZE = 16;
let NUMBER_OF_MINES = 40;
let GAME_START = true;

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElem = document.querySelector(".board")
const gameFace = document.querySelector(".gameFace")

// Создаем интерактивную доску__________________________________

function generateBoard() {
   board.forEach(row => {
   row.forEach(tile => {
      boardElem.append(tile.element)
      tile.element.addEventListener("click", () => {
         if (GAME_START === true) {
            if (tile.mine) {
               let emptyTiles = []
               board.forEach(row => {
                  let rowArray = row.filter(tile =>  tile.mine === false)
                  rowArray.forEach(i => emptyTiles.push(i))
               })
               const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
               randomTile.mine = true
            }
            tile.mine = false
            revealTile(board, tile)
            GAME_START = false
            sec = 0
         } else {
            revealTile(board, tile)
            checkGameEnd(tile)
         }
      })
      tile.element.addEventListener("mousedown", (e) => {
         e.preventDefault()
         if (GAME_START === true || tile.status !== "hidden") {
            return
         } else {
            switch (e.button) {
               case 0: {
                  gameFace.classList.add("scared-face");
                  break;
               };
               case 2: {
                  break;
               }
            }
         }
      })
      tile.element.addEventListener("mouseup", (e) => {
         e.preventDefault()
         gameFace.classList.remove("scared-face")
      })
      tile.element.addEventListener("contextmenu", (e) => {
         e.preventDefault()
         markTile(tile)
         listMinesLeft()
      })
   })
});
}
boardElem.style.setProperty("--size", BOARD_SIZE)

generateBoard()

// Таймер бомб___________________

export let minesArray = ("" + NUMBER_OF_MINES).split("").map(e => e);

const bombsCounter = (item, elem) => {
   elem.className = (`number number-${item}`)
}

function minesTimer() {
   let elemFirst = document.getElementById("first")
   let elemSecond = document.getElementById("second")

   if (minesArray[0] === "-") {
      bombsCounter(0, elemFirst)
      bombsCounter(0, elemSecond)
   } else if (minesArray.length > 1) {
      bombsCounter(minesArray[1], elemFirst)
      bombsCounter(minesArray[0], elemSecond)
   } else {
      bombsCounter(minesArray[0], elemFirst)
      bombsCounter(0, elemSecond)
   } 
}

function listMinesLeft() {
   const markedTilesCount = board.reduce((count, row) => {
      return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
   }, 0)
   minesArray = ("" + (NUMBER_OF_MINES - markedTilesCount)).split("").map(e => e);
   minesTimer()
}
listMinesLeft()

// Статус игры_________________________

function checkGameEnd(tile) {
   const win = checkWin(board)
   const lose = checkLose(board)
   const gameRestart = checkRestart(board)

   if(win || lose) {
      boardElem.addEventListener("click", stopProp, {capture: true})
      boardElem.addEventListener("contextmenu", stopProp, {capture: true})
      GAME_START = true
   } else if (gameRestart) {
      boardElem.removeEventListener("click", stopProp, {capture: true})
      boardElem.removeEventListener("contextmenu", stopProp, {capture: true})
      GAME_START = true
   }
   if (win) {
      gameFace.classList.add("cool-face")
   } else if (lose) {
      tile.element.dataset.status  = "blow"
      minesArray = [0, 0]
      minesTimer()
      gameFace.classList.add("sad-face")
      board.forEach(row => {
         row.forEach(tile => {
            if (tile.status === TILE_STATUSES.MARKED) tile.status = TILE_STATUSES.HIDDEN;
            if (tile.mine) {
               revealTile(board, tile)
            }
         })
      })
   }
}

function stopProp(e) {
   e.stopImmediatePropagation()
}

// Перезапуск игры___________________________

const tiles = document.querySelectorAll('[id=tile]');
function removeTiles() {
      tiles.forEach( ()  => {
      const tile = document.getElementById("tile")
      tile.remove()
   })
} 

gameFace.addEventListener("click", (e) => {
   e.preventDefault()
   GAME_START = true
   removeTiles()
   board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
   generateBoard()
   checkGameEnd()
   gameFace.className = "gameFace"
   listMinesLeft()
   sec = 0
   elemFirst.className = "number number-0"
   elemSecond.className = "number number-0"
   elemThird.className = "number number-0"
})

// Таймер секунд___________________________
   
const stopwatch = (item, elem) => {
   elem.className = (`number number-${item}`)
}

let sec = 0
const elemFirst = document.getElementById("first-sec")
const elemSecond = document.getElementById("second-sec")
const elemThird = document.getElementById("third-sec")

const timerId = setInterval(() => {
   if (GAME_START === true) {
      return
   } else {
      [sec++]
      let timerValue = ("" + sec).split("").map(e => e);
      switch (timerValue.length) {
         case 1: {
            stopwatch(0, elemThird);
            stopwatch(0, elemSecond);
            stopwatch(timerValue[0], elemFirst);
         break;
         };
         case 2: {
            stopwatch(0, elemThird);
            stopwatch(timerValue[0], elemSecond);
            stopwatch(timerValue[1], elemFirst);
         break;
         };
         case 3: {
            stopwatch(timerValue[0], elemThird);
            stopwatch(timerValue[1], elemSecond);
            stopwatch(timerValue[2], elemFirst);
         break;
         }
         default:
            stopwatch(9, elemThird);
            stopwatch(9, elemSecond);
            stopwatch(9, elemFirst);
            break;
      }
   }
}, 1000);




