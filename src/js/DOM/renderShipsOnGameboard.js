function renderShipsOnGameBoard(gameboard, gameboardClass) {
  const selectedGameboard = document.querySelector(`.${gameboardClass}`);

  const gameboardSize = gameboard.getSize();
  const board = gameboard.getBoard();
  for (let row = 0; row < gameboardSize; row++) {
    for (let col = 0; col < gameboardSize; col++) {
      let ship = board[row][col];
      if (ship !== null) {
        let cellDOM = selectedGameboard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cellDOM.dataset.shipName = ship.name;
      }
    }
  }
}

export default renderShipsOnGameBoard;
