import Board from "./board.js";

const board = new Board();
let statusLabel = null;

function checkInits() {
    if (statusLabel === null) {
        statusLabel = document.getElementById("status");
    }
}

function updateStatus() {
    if (board.winner !== null) {
        statusLabel.innerHTML = board.winner + " wins!";
    } else if (board.isPlayer1Turn) {
        statusLabel.innerHTML = "Player 1's turn";
    } else {
        statusLabel.innerHTML = "Player 2's turn";
    }
}

function onPageLoad() {
    console.log("onPageLoad");
    checkInits();
    updateStatus();
}

export function onMove(element, btn_id) {
    if (board.winner !== null) return;
    const index = btn_id;
    if (board.squares[index]) return;

    if (board.isPlayer1Turn) {
        element.innerHTML = "X";
        board.squares[index] = "X";
    } else {
        element.innerHTML = "O";
        board.squares[index] = "O";
    }
    board.isPlayer1Turn = !board.isPlayer1Turn;
    board.winner = board.calculateWinner(board.squares);
    updateStatus();
}

function resetGame() {
    board.reset();
    updateStatus();
    for (let i = 0; i < board.squares.length; i++) {
        document.getElementById("btn_" + (i+1)).innerHTML = "";
    }
}

window.onMove = onMove;
window.onPageLoad = onPageLoad;
window.resetGame = resetGame;
