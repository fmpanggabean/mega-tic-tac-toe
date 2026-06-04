document.addEventListener('DOMContentLoaded', () => {
    const megaBoardEl = document.getElementById('mega-board');
    const scoreboardEl = document.getElementById('scoreboard');

    // State
    const boards = []; // 25 boards
    for (let i = 0; i < 25; i++) {
        boards.push({
            cells: Array(9).fill(null),
            winner: null,
            disabled: false,
            element: null
        });
    }

    let hoveredCell = null; // { boardIndex, cellIndex, element }

    // Init UI
    function initBoard() {
        // Add top coordinates
        const corner = document.createElement('div');
        megaBoardEl.appendChild(corner);
        
        const letters = ['A', 'B', 'C', 'D', 'E'];
        for (let i = 0; i < 5; i++) {
            const coord = document.createElement('div');
            coord.classList.add('coord');
            coord.textContent = letters[i];
            megaBoardEl.appendChild(coord);
        }

        for (let b = 0; b < 25; b++) {
            // Add left coordinate for the start of each row
            if (b % 5 === 0) {
                const coord = document.createElement('div');
                coord.classList.add('coord');
                coord.textContent = (b / 5) + 1;
                megaBoardEl.appendChild(coord);
            }

            const subBoard = document.createElement('div');
            subBoard.classList.add('sub-board');
            boards[b].element = subBoard;

            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.board = b;
                cell.dataset.cell = c;

                cell.addEventListener('mouseenter', () => {
                    hoveredCell = { boardIndex: b, cellIndex: c, element: cell };
                });

                cell.addEventListener('mouseleave', () => {
                    if (hoveredCell && hoveredCell.element === cell) {
                        hoveredCell = null;
                    }
                });

                // For mobile or click-focus
                cell.addEventListener('click', () => {
                    document.querySelectorAll('.cell.focused').forEach(el => el.classList.remove('focused'));
                    cell.classList.add('focused');
                    hoveredCell = { boardIndex: b, cellIndex: c, element: cell };
                });

                subBoard.appendChild(cell);
            }
            megaBoardEl.appendChild(subBoard);
        }
    }

    function checkWinner(boardIndex) {
        const b = boards[boardIndex];
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]             // diags
        ];

        for (let line of lines) {
            const [x, y, z] = line;
            if (b.cells[x] !== null && b.cells[x] === b.cells[y] && b.cells[x] === b.cells[z]) {
                return b.cells[x]; // Winning number
            }
        }
        
        // Check draw (all filled)
        if (!b.cells.includes(null)) {
            return 'draw';
        }
        
        return null;
    }

    function handleInput(number) {
        if (!hoveredCell) return;
        const { boardIndex, cellIndex, element } = hoveredCell;

        if (boards[boardIndex].disabled) return;
        
        const previousNumber = boards[boardIndex].cells[cellIndex];
        if (previousNumber === number) return; // No change needed

        // Place or override number
        boards[boardIndex].cells[cellIndex] = number;
        element.textContent = number;
        
        if (previousNumber !== null) {
            element.classList.remove(`num-${previousNumber}`);
            // Restart the animation for visual feedback
            element.classList.remove('filled');
            void element.offsetWidth; // Trigger reflow
        }
        
        element.classList.add('filled', `num-${number}`);
        element.classList.remove('focused');

        // Check if this placement wins the board
        const winner = checkWinner(boardIndex);
        if (winner && winner !== 'draw') {
            boards[boardIndex].winner = winner;
            boards[boardIndex].disabled = true;
            boards[boardIndex].element.classList.add('disabled');
            boards[boardIndex].element.setAttribute('data-winner', winner);
        } else if (winner === 'draw') {
            boards[boardIndex].disabled = true;
            boards[boardIndex].element.style.opacity = '0.5';
        }

        updateScoreboard();
        
        // Keep hoveredCell correct if mouse hasn't moved
        hoveredCell = null;
    }

    function handleClear() {
        if (!hoveredCell) return;
        const { boardIndex, cellIndex, element } = hoveredCell;

        const previousNumber = boards[boardIndex].cells[cellIndex];
        if (previousNumber === null) return; // Sudah kosong

        boards[boardIndex].cells[cellIndex] = null;
        element.textContent = '';
        element.classList.remove(`num-${previousNumber}`);
        element.classList.remove('filled');
        element.classList.remove('focused');

        // Evaluasi ulang pemenang sub-board setelah penghapusan
        const winner = checkWinner(boardIndex);
        if (winner && winner !== 'draw') {
            boards[boardIndex].winner = winner;
            boards[boardIndex].disabled = true;
            boards[boardIndex].element.classList.add('disabled');
            boards[boardIndex].element.setAttribute('data-winner', winner);
            boards[boardIndex].element.style.opacity = '';
        } else if (winner === 'draw') {
            boards[boardIndex].winner = 'draw';
            boards[boardIndex].disabled = true;
            boards[boardIndex].element.classList.remove('disabled');
            boards[boardIndex].element.removeAttribute('data-winner');
            boards[boardIndex].element.style.opacity = '0.5';
        } else {
            // Jika kondisi menang/seri hilang, aktifkan kembali sub-board ini
            boards[boardIndex].winner = null;
            boards[boardIndex].disabled = false;
            boards[boardIndex].element.classList.remove('disabled');
            boards[boardIndex].element.removeAttribute('data-winner');
            boards[boardIndex].element.style.opacity = '';
        }

        updateScoreboard();
        
        // Reset hoveredCell agar konsisten
        hoveredCell = null;
    }

    function calculateScores() {
        const scores = {}; // Key: number, Value: score object
        
        // Find all numbers that have been played
        const activeNumbers = new Set();
        boards.forEach(b => {
            b.cells.forEach(c => {
                if (c !== null) activeNumbers.add(c);
            });
        });

        activeNumbers.forEach(num => {
            scores[num] = { blocks: 0, bonus: 0, total: 0 };
        });

        boards.forEach(board => {
            board.cells.forEach(cellValue => {
                if (cellValue !== null) {
                    if (board.winner === null || board.winner === 'draw') {
                        // Not won by anyone, all numbers get points
                        scores[cellValue].blocks++;
                    } else {
                        // Won by someone
                        if (cellValue == board.winner) {
                            // Winner gets their block points
                            scores[cellValue].blocks++;
                        }
                        // Other numbers in this board are nulled, so they get 0 blocks here
                    }
                }
            });

            if (board.winner !== null && board.winner !== 'draw') {
                scores[board.winner].bonus++; // 1 board won
            }
        });

        // Calculate totals
        for (let num in scores) {
            scores[num].total = (scores[num].blocks * 10) + (scores[num].bonus * 20);
        }

        return scores;
    }

    function updateScoreboard() {
        const scores = calculateScores();
        // Sort by score descending
        const sortedScores = Object.entries(scores).sort((a, b) => b[1].total - a[1].total);

        scoreboardEl.innerHTML = '';

        if (sortedScores.length === 0) {
            scoreboardEl.innerHTML = '<p style="color: var(--text-muted); text-align: center; font-style: italic;">Waiting for first move...</p>';
            return;
        }

        sortedScores.forEach(([num, data]) => {
            const item = document.createElement('div');
            item.classList.add('score-item');
            
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('score-player');
            
            const numIcon = document.createElement('div');
            numIcon.classList.add('score-number', `num-${num}`);
            numIcon.textContent = num;
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = `Player ${num}`;

            playerDiv.appendChild(numIcon);
            playerDiv.appendChild(nameSpan);

            const valueDiv = document.createElement('div');
            valueDiv.classList.add('score-value');
            valueDiv.textContent = data.total;

            item.appendChild(playerDiv);
            item.appendChild(valueDiv);

            scoreboardEl.appendChild(item);
        });
    }

    // Keyboard listener
    window.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.code === 'Space') {
            if (hoveredCell) {
                e.preventDefault(); // Mencegah halaman scroll ke bawah
                handleClear();
            }
        }
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
            handleInput(num);
        }
    });

    initBoard();
    updateScoreboard();
});
