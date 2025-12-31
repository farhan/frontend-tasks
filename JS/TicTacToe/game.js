import Board from "./board.js";

window.addEventListener("load", onPageLoad);
const board = new Board();
let statusLabel = null;

function onPageLoad() {
    bindElements();
    updateStatus();
}

function bindElements() {
    if (statusLabel === null) {
        statusLabel = document.getElementById("status");
    }
    for (let i = 0; i < board.squares.length; i++) {
        document.getElementById("btn_" + (i+1)).addEventListener("click", 
            function() { onMove(this, i); }
        );
    }
    document.getElementById("btn_reset").addEventListener("click", resetGame);
}

function updateStatus() {
    if (board.winner !== null) {
        statusLabel.innerHTML = board.winner + " wins!";
    } else if (board.checkIfDraw()) {
        statusLabel.innerHTML = "It's a draw";
    } else if (board.isPlayer1Turn) {
        statusLabel.innerHTML = "Player 1's turn";
    } else {
        statusLabel.innerHTML = "Player 2's turn";
    }
}

function onMove(element, btn_id) {
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
    board.winner = board.calculateWinner();
    updateStatus();
}

function resetGame() {
    board.reset();
    updateStatus();
    for (let i = 0; i < board.squares.length; i++) {
        document.getElementById("btn_" + (i+1)).innerHTML = "";
    }
}
