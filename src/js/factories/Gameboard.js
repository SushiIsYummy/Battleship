function Gameboard() {
  let boardSize = 10;
  let board = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(null));

  let boardHits = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(false));
  let ships = [];

  function isValidShipPlacement(shipData) {
    const { length, row, col, orientation } = shipData;
    // Check if the ship placement goes out of bounds
    if ((orientation === 'horizontal' && col + length > boardSize) || (orientation === 'vertical' && row + length > boardSize)) {
      return false;
    }

    // Check for overlapping ships
    if (orientation === 'horizontal') {
      for (let i = 0; i < length; i++) {
        if (board[row][col + i] != null) {
          return false;
        }
      }
    } else if (orientation === 'vertical') {
      for (let i = 0; i < length; i++) {
        if (board[row + i][col] != null) {
          return false;
        }
      }
    }

    return true; // The placement is valid
  }

  return {
    receiveAttack(row, col) {
      if (boardHits[row][col] !== false) {
        return;
      }
      let ship = board[row][col];
      if (ship !== null) {
        ship.hit(row, col);
        boardHits[row][col] = 'hit';
      } else {
        boardHits[row][col] = 'miss';
      }
    },
    placeShip(ship, shipData) {
      if (isValidShipPlacement(shipData)) {
        const { row, col, name, length, orientation } = shipData;

        if (orientation === 'horizontal') {
          for (let i = 0; i < length; i++) {
            board[row][col + i] = ship;
            ships.push(ship);
          }
        } else if (orientation === 'vertical') {
          for (let i = 0; i < length; i++) {
            board[row + i][col] = ship;
            ships.push(ship);
          }
        }
        return true;
      }
      return false;
    },
    allShipsSunk() {
      for (let i = 0; i < ships.length; i++) {
        if (!ships[i].isSunk()) {
          return false;
        }
      }
      return true;
    },
    // fillBoardRandomly(shipDataArray) {
    //   shipDataArray.forEach((shipData) => {});
    // },
    getSize() {
      return boardSize;
    },
    getBoard() {
      // return JSON.parse(JSON.stringify(board));
      return board;
    },
    getBoardHits() {
      return JSON.parse(JSON.stringify(boardHits));
    },
    cellHitInfo(row, col) {
      return boardHits[row][col];
    },
    displayBoard() {
      console.table(board);
    },
  };
}

export default Gameboard;
