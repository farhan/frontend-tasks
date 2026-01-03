import Board from "./board.js";
import GameHistory from "./game_history.js";

window.addEventListener("load", onPageLoad);
const board = new Board();
const game_history = new GameHistory();
let statusLabel = null;
let history_list = null;

function onPageLoad() {
    bindElements();
    updateStatus();
}

function bindElements() {
    if (statusLabel === null) {
        statusLabel = document.getElementById("status");
    }
    if (history_list === null) {
        history_list = document.getElementById("history_list");
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

function updateHistory(board) {
    game_history.addBoard(board);
    const li = document.createElement("li");
    const button = document.createElement("button");
    const moveNumber = game_history.boards_history.length;
    button.innerHTML = "Go to move # " + moveNumber;
    button.addEventListener("click", () => {
        jumpTo(moveNumber - 1);
    });
    li.appendChild(button);
    history_list.appendChild(li);
}

function jumpTo(moveIndex) {
    // Retrieve the board state at moveIndex from history
    const boardState = game_history.boards_history[moveIndex];
    if (!boardState) return;

    // Update main board object in-place
    board.squares = [...boardState.squares];
    board.isPlayer1Turn = boardState.isPlayer1Turn;
    board.winner = boardState.winner;

    // Update board UI
    for (let i = 0; i < board.squares.length; i++) {
        document.getElementById("btn_" + (i + 1)).innerHTML = board.squares[i] || "";
    }

    // Remove forward history from logic and UI
    game_history.boards_history = game_history.boards_history.slice(0, moveIndex + 1);
    while (history_list.children.length > moveIndex + 1) {
        history_list.removeChild(history_list.lastChild);
    }

    updateStatus();
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
    updateHistory(board);
}

function resetGame() {
    board.reset();
    game_history.reset();
    updateStatus();
    history_list.innerHTML = "";
    for (let i = 0; i < board.squares.length; i++) {
        document.getElementById("btn_" + (i+1)).innerHTML = "";
    }
}
