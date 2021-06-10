class Game {
    constructor(height, width, player1, player2) {
        this.btnClickCount = 0;
        this.gameOver = false;
        this.height = height;
        this.width = width;
        this.player1 = player1;
        this.player2 = player2;
        this.currPlayer = 1;
        this.board = [];
        this.sidebarDisplayed = false;
        const btn = document.querySelector('button');
        btn.addEventListener('click', this.btnClick.bind(this));
        const directionsMenu = document.querySelector('#burger');
        directionsMenu.addEventListener('click', this.openSidebar.bind(this));
        window.addEventListener('resize', this.closeSidebarIfScreenTooWide.bind(this));
    }

    makeBoard() {
        for (let y = 0; y < this.height; y++) {
          this.board.push(Array.from({ length: this.width }));
        };
    };

    makeHtmlBoard() {
        const board_ = document.getElementById('board');
        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        top.addEventListener('click', this.handleClick.bind(this));
        for (let x = 0; x < this.width; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          headCell.style.border = 'dashed 1px lightgray';
          top.append(headCell);
        }
      
        board_.append(top);
      
        // make main part of board
        for (let y = 0; y < this.height; y++) {
          const row = document.createElement('tr');
      
          for (let x = 0; x < this.width; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
          }
      
          board_.append(row);
        }
    }

    // This function is used to dynamically add a class to the piece
    // depending on what row it is in. This determines the starting
    // "top" position of the piece, which later plays a part in its
    // falling animation to its resting position.
    addClass(coord) {
        switch(coord) {
        case 0:
            return 'zero';
        case 1:
            return 'one';
        case 2:
            return 'two';
        case 3:
            return 'three';
        case 4:
            return 'four';
        case 5:
            return 'five';
        };
    };

    // finds the correct spot for the chip to be placed on; returns "null" if there is no spot.
    findSpotForCol(x) {
        for (let y = this.height - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }

    // places the pieces in the correct spot in the table, if there is a place to put them in.
    placeInTable(y, x) {
        if (!this.gameOver) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.classList.add(this.addClass(y));
            // add the color based on the player object's color value
            piece.style.backgroundColor = this.currPlayer === 1 ? this.player1.color : this.player2.color;
            const spot = document.getElementById(`${y}-${x}`);
            spot.append(piece);
            // this is used to create the transition so that the pieces fall in an animated fashion
            setTimeout(() => {
                piece.classList.add('lower');
              },10);
        };
    };

    // handles how the message is displayed when the game ends.
    endGame(msg) {
        if (!this.gameOver) {
            let counter = 0;
            this.gameOver = true;
            const winningMessage = document.querySelector('.message');
            winningMessage.innerText = msg;
            // setting up a flashing message for the winner (or a tie).
            let flashingMessage = setInterval(() => {
                winningMessage.style.display = 'block';
                setTimeout(() => {
                    winningMessage.style.display = 'none';
                }, 500);
                counter++;
                if (counter === 10) {
                    clearInterval(flashingMessage);
                }
            }, 1000);
        }
    }

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
      
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
      
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin()) {
          return this.endGame(`Player ${this.currPlayer} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
          
        // switch players
        this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }

    // used to remove all game pieces from board on a restart.
    removeGamePieces() {
        const allGamePieces = document.querySelectorAll('.piece');
        for (let piece of allGamePieces) {
            piece.remove()
        }
    }

    /** btnClick: handle the case of a button being clicked to start the game, and restart the game. */
    btnClick() {
        const gameBoard = document.querySelector('#board');
        const player1Input = document.querySelector('#p1color');
        const player2Input = document.querySelector('#p2color');

        // what to do if the game is started for the first time.
        if (this.btnClickCount === 0) {
            gameBoard.style.display = 'block';
            if (gameBoard.childElementCount === 0) {
                this.makeBoard();
                this.makeHtmlBoard();
            }
        // what to do on any subsequent click of the button.
        } else {
            this.removeGamePieces();
            // start the in-memory board over again, too.
            this.board = [];
            this.makeBoard();
        }
        this.gameOver = false;
        this.currPlayer = 1;
        this.btnClickCount++;
        this.player1.color = player1Input.value;
        this.player2.color = player2Input.value;
    }

    openSidebar() {
        const theGameBoard = document.querySelector('#game');
        const directions = document.querySelector('.directions');
        if (this.sidebarDisplayed) {
            directions.style.width = '0px';
            setTimeout(() => {
                theGameBoard.style.display = 'block';
            },1000);
            this.sidebarDisplayed = false;
        } else {
            directions.style.width = '900px';
            theGameBoard.style.display = 'none';
            this.sidebarDisplayed = true;
        }
    }

    closeSidebarIfScreenTooWide() {
        const theGameBoard = document.querySelector('#game');
        const directionsDiv = document.querySelector('.directions');
        if (window.innerWidth > 900) {
            directionsDiv.style.width = '0px';
            this.sidebarDisplayed = false;
            setTimeout(() => {
                theGameBoard.style.display = 'block';
            },1000);
        }
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        const HEIGHT = this.height;
        const WIDTH = this.width;
        let BOARD = this.board;
        let CURRPLAYER = this.currPlayer;

        function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
    
            return cells.every(
                ([y, x]) =>
                y >= 0 &&
                y < HEIGHT &&
                x >= 0 &&
                x < WIDTH &&
                BOARD[y][x] === CURRPLAYER
            );
        }
    
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        
                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
};

// A simple player class used to generate different colors for the game pieces
class Player {
    constructor(color = null) {
        this.color = color;
    };
};

const player1 = new Player('red');
const player2 = new Player('blue');
new Game(6, 7, player1, player2);