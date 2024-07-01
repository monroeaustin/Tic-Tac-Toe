// Game Module
gameBoard = () => {

    let board = {
        0: [undefined, undefined, undefined],
        1: [undefined, undefined, undefined],
        2: [undefined, undefined, undefined]
    };

    function ShowWinner(player) {
        const TurnDisplay = document.querySelector('#show-turn');
        TurnDisplay.innerHTML = `${player} Wins!`;
        const allCellDivs = document.querySelectorAll(".cell");
    }

    function ShowTie() {
        const TurnDisplay = document.querySelector('#show-turn');
        TurnDisplay.innerHTML = "It's a tie!";
    }

    function selectCell() {
        const allCellDivs = document.querySelectorAll(".cell");

        makeMove = (currentPlayer, rowIndex, columIndex, cell) => {
            if (board[rowIndex][columIndex] === undefined) {

                board[rowIndex][columIndex] = currentPlayer;
                cell.innerHTML = currentPlayer;

                function checkWin(board, currentPlayer) {
                    // Check horizontal rows
                    for (let i = 0; i < 3; i++) {
                        if (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) {
                            ShowWinner(currentPlayer);
                            removeEventListeners();
                            return true;
                        }
                    }

                    // Check vertical columns
                    for (let i = 0; i < 3; i++) {
                        if (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer) {
                            ShowWinner(currentPlayer);
                            removeEventListeners();
                            return true;
                        }
                    }

                    // Check diagonals
                    if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) {
                        ShowWinner(currentPlayer);
                        removeEventListeners();
                        return true;
                    }
                    if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
                        ShowWinner(currentPlayer);
                        removeEventListeners();
                        return true;
                    }

                    return false;
                }

                function checkTie(board) {
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (board[i][j] === undefined) {
                                return false;
                            }
                        }
                    }
                    ShowTie();
                    removeEventListeners();
                    return true;
                }

                if (!checkWin(board, currentPlayer)) {
                    checkTie(board);
                }

            } else {
                console.warn("This cell has been chosen.");
                return;
            }

            console.log(board)
        }
        return makeMove;
    }

    function removeEventListeners() {
        const allCellDivs = document.querySelectorAll(".cell");
        allCellDivs.forEach(cell => {
            cell.replaceWith(cell.cloneNode(true));
        });
    }

    function resetBoard() {
        formatBoard = () => {
            Object.keys(board).forEach(key => {
                board[key].fill(undefined);
                console.log(board)
            });
        }
        return formatBoard();
    }

    return {
        makeMove: selectCell,
        restartBoard: resetBoard
    };
}

// Render Modules
renderUI = () => {
    const allCellDivs = document.querySelectorAll(".cell");
    const playerOneName = document.querySelector('input#playerOneName');
    const playerOneMarker = document.querySelector('label#markerP1')
    const playerTwoName = document.querySelector('input#playerTwoName');
    const playerTwoMarker = document.querySelector('label#markerP2');

    const addListener = () => {

        function attachListener() {
            let createFirstPlayer = () => {
                let playerOne = {
                    id: playerOneName.value,
                    marker: playerOneMarker.innerHTML,
                    isTurn: true,
                    switchTurn: () => {
                        playerOne.isTurn = !playerOne.isTurn;
                    }
                }
                return playerOne
            }

            let createSecondPlayer = () => {
                let playerTwo = {
                    id: playerTwoName.value,
                    marker: playerTwoMarker.innerHTML,
                    isTurn: false,
                    switchTurn: () => {
                        playerTwo.isTurn = !playerTwo.isTurn;
                    }
                }
                return playerTwo
            }

            let playerTwoObj = createSecondPlayer();
            let playerOneObj = createFirstPlayer();

            const ValidateMoves = (cell) => {
                let rIndex = cell.getAttribute("rowindex");
                let cIndex = cell.getAttribute("columindex");
                let cInner = cell.innerHTML;
                if (cInner !== '') {
                    return;
                } else {
                    if (playerOneObj.isTurn === true) {
                        displayWhosTurn().updatePlayerDisplay(playerTwoName.value)
                        play(playerOneObj.marker, rIndex, cIndex, cell);
                        playerOneObj.switchTurn();
                        playerTwoObj.switchTurn();
                        timerUI(playerOneObj);
                        console.log(playerOneObj);
                    } else if (playerTwoObj.isTurn === true) {
                        displayWhosTurn().updatePlayerDisplay(playerOneName.value)
                        play(playerTwoObj.marker, rIndex, cIndex, cell);
                        playerTwoObj.switchTurn();
                        playerOneObj.switchTurn();
                        timerUI(playerTwoObj);
                        console.log(playerTwoObj);
                    }
                }
            }

            function resetGame() {
                const allCellDivs = document.querySelectorAll(".cell");
                const form = document.querySelector('form#dialog')
                const topDiv = document.querySelector('.top-display');
                const bottomDiv = document.querySelector('.cta-view');
                form.setAttribute("style", "display:flex");
                topDiv.setAttribute("style", "display:none");
                bottomDiv.setAttribute("style", "display:none")
                gameBoard().restartBoard();
                Game.restartBoard();
                allCellDivs.forEach(box => {
                    box.innerHTML = "";
                    form.reset();
            
            
                    box.addEventListener("click", function listen(e) {
                        ValidateMoves(box);
                        e.stopPropagation();
                    }
                );
            })}
            newGameBtn = document.querySelector('#reset');
newGameBtn.addEventListener("click",resetGame)

            allCellDivs.forEach(cell => {
                cell.addEventListener("click", function listen(e) {
                    ValidateMoves(cell);
                    e.stopPropagation();
                });
            });
        }
        return attachListener();
    }

    const formWorkflow = () => {
        const topDiv = document.querySelector('.top-display');
        const bottomDiv = document.querySelector('.cta-view');
        const ctabtn = document.querySelector('button#startgame');
        const form = document.querySelector('form#dialog')

        function setState() {

            ctabtn.addEventListener("click", function (event) {
                event.preventDefault();
                displayWhosTurn().updatePlayerDisplay(playerOneName.value)
                timerUI();

                form.setAttribute("style", "display:none");
                topDiv.setAttribute("style", "display:grid");
                bottomDiv.setAttribute("style", "display:grid");
                // Create Player When Button is Clicked
                GameAddons.listentoGame();
            })
        }
        return setState();
    }

    return {
        listentoGame: addListener,
        setState: formWorkflow,
        displayPlayer: displayWhosTurn()
    }
}

let timer; // Declare timer variable in a higher scope so it can be accessed globally

const timerUI = (object) => {
    const runTimer = (object) => {
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
        }

        let seconds = 15;

        timer = setInterval(function () {
            document.getElementById('counter-clock').innerHTML = '00:' + (seconds < 10 ? '0' : '') + seconds;
            seconds--;
            if (seconds < 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
    return runTimer(object); // Pass the object argument to the runTimer function
}

const displayWhosTurn = () => {
    const TurnDisplay = document.querySelector('#show-turn')
    let identifyPlayer = (PlayerObjOneName) => {
        TurnDisplay.innerHTML = `It is ${PlayerObjOneName} 's Turn`;
        console.log("HI");
    }
    return {
        updatePlayerDisplay: identifyPlayer
    }
}



// Global Variables
let GameAddons = renderUI();
GameAddons.setState();
let Game = gameBoard();
// Global Scopes
let play = Game.makeMove();