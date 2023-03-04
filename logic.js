import { minesArray } from "./script.js"

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
    MARKED_NOT_SURE: "marked_not_sure",
}

export function createBoard(boardSize, numberOfMines) {
    let board = []
    let minePositions = getMinePositions(boardSize, numberOfMines)
    for (let x = 0; x < boardSize; x++) {
        const row = []
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("button")
            element.className = "tile";
            element.id = "tile"
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile) {
    if (minesArray[0] === "0") {
        switch (tile.status) {
            case "marked":
                 tile.status = TILE_STATUSES.MARKED_NOT_SURE;
                 break;
            case "marked_not_sure":
                 tile.status = TILE_STATUSES.HIDDEN;
                 break;
        } 
     } else {
        switch (tile.status) {
            case "hidden":
                 tile.status = TILE_STATUSES.MARKED;
                 break;
            case "marked":
                 tile.status = TILE_STATUSES.MARKED_NOT_SURE;
                 break;
            case "marked_not_sure":
                 tile.status = TILE_STATUSES.HIDDEN;
                 break;
        } 
     }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }
    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }

    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.className = `tile near-mines-${mines.length}`
        return
    }
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }
        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
    }
    return positions
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

export function checkRestart(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.HIDDEN
        })
    })
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

export function nearbyTiles(board, {x, y}) {
    const tiles = []

    for (let xOffset = -1; xOffset <=1; xOffset++){
        for (let yOffset = -1; yOffset <=1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if(tile) tiles.push(tile)
        }
    }

    return tiles
}