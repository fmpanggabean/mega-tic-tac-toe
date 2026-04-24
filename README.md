# Mega Tic-Tac-Toe

Mega Tic-Tac-Toe is a chaotic, competitive, number-based twist on classic Tic-Tac-Toe built with vanilla HTML, CSS, and JavaScript.

Instead of just playing on a simple 3x3 board, you play on a massive **5x5 grid of 3x3 boards**! It features a dynamic scoring system where capturing cells gives you points, but winning grids allows you to completely nullify your opponents' points!

## 🎮 How to Play

1. **Launch the Game:** Open `index.html` in your web browser.
2. **Claiming Cells:** The game is played using your keyboard. Hover your mouse over any active cell and press a number key (`1` to `9`) to claim the cell for your player number. You can also click a cell to select it and then press a number key.
3. **Overriding:** You can aggressively override an opponent's cell by hovering over it and typing your number before the grid is completed!
4. **Winning Grids:** Try to get 3 of your numbers in a row (horizontally, vertically, or diagonally) within one of the 3x3 sub-boards to conquer it!

## 💯 Scoring & Rules

- **Claiming a Cell (+10 pts):** Placing your number in a grid grants you 10 points immediately.
- **Winning a Grid (+20 pts):** Getting a 3-in-a-row inside a small grid permanently secures that grid, locks it from further play, and grants you 20 bonus points.
- **Nullified Points:** **Here is the twist!** When a player wins a 3x3 grid, any other opponents' numbers that were present in that grid are **nullified**. Those opponents lose the 10 points they originally gained from those cells, but the winner keeps all of theirs.
- **Game End:** The game progresses until all 25 grids are secured or drawn. Keep an eye on the live Scoreboard to see who is leading!

## 🛠️ Technology Stack

- **HTML5:** Semantic and structured game layout.
- **CSS3:** Modern aesthetics featuring a sleek dark mode, glassmorphism panels, dynamic neon player colors, smooth CSS animations, and a responsive CSS Grid architecture.
- **Vanilla JavaScript (ES6+):** Real-time state management, dynamic score calculations, multidimensional winning logic algorithms, and keyboard-based event handling. No external frameworks or libraries were used!

## 💻 Local Development

No server or build process is required to run the game. Simply open the `index.html` file in your preferred web browser to start playing right away.
