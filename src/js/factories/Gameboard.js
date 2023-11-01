import Ship from './Ship';
import ShipData from '../../data/ShipData';

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
        ship.hit();
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
            ship.addPosition(row, col + i);
          }
        } else if (orientation === 'vertical') {
          for (let i = 0; i < length; i++) {
            board[row + i][col] = ship;
            ship.addPosition(row + i, col);
          }
        }
        ships.push(ship);
        return true;
      }
      return false;
    },
    placeShipsRandomly() {
      ShipData.forEach((shipData) => {
        let ship = Ship(shipData.name, shipData.length);
        let shipDataCopy = { ...shipData };
        do {
          let row = Math.floor(Math.random() * (this.getSize() - 0) + 0);
          let col = Math.floor(Math.random() * (this.getSize() - 0) + 0);
          let orientationBool = Math.round(Math.random());
          let orientation = orientationBool ? 'horizontal' : 'vertical';
          shipDataCopy.row = row;
          shipDataCopy.col = col;
          shipDataCopy.orientation = orientation;
          // console.log(shipDataCopy);
        } while (this.placeShip(ship, shipDataCopy) !== true);
      });
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
    clearBoard() {
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          board[row][col] = null;
        }
      }
    },
    getBoardHits() {
      return JSON.parse(JSON.stringify(boardHits));
    },
    resetBoardHits() {
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          boardHits[row][col] = false;
        }
      }
    },
    getShips() {
      return [...ships];
    },
    removeAllShips() {
      ships = [];
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
