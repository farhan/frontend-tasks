# Tic Tac Toe

Introduces a minimal, playable Tic Tac Toe web app with board logic, UI wiring, and local serve script.

## Implementation Details

- **Board Class (`board.js`):** Manages turn state, squares array, reset logic, and winner calculation.
- **Game Logic (`game.js`):** Manages moves, toggles turns, updates status, and exposes window handlers (`onMove`, `onPageLoad`, `resetGame`).
- **UI (`index.html`):** Renders a 3x3 grid of buttons, status label, and loads `game.js` as an ES module.
- **Styling (`styles.css`):** Basic styling for squares, rows, and layout.
- **Development (`Makefile`):** Includes a `serve` target to run the app via `python3 -m http.server 8000`.

## How to Run

1. Navigate to this directory:
   ```bash
   cd JS/TicTacToe
   ```
2. Start the local server:
   ```bash
   make serve
   ```
3. Open [http://localhost:8000](http://localhost:8000) in your browser.

