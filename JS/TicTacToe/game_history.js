class GameHistory {
    constructor() {
        this.boards_history = []
    }

    reset() {
        this.boards_history = []
    }

    addBoard(board) {
        this.boards_history.push({
            squares: [...board.squares],
            isPlayer1Turn: board.isPlayer1Turn,
            winner: board.winner
        });
    }

    setBoard(index, board) {
        if (index < 0 || index >= this.boards_history.length) {
            throw new Error("Index out of bounds");
        }
        this.boards_history[index] = board;
        // Remove any forward history after this index (since it's a move backward)
        this.boards_history = this.boards_history.slice(0, index + 1);
    }
}

export { GameHistory as default };
