import Gameboard from '../js/factories/Gameboard.js';
import ShipData from '../data/ShipData.js';

let gameboard;

beforeEach(() => {
  gameboard = Gameboard();
});

test('place destroyer horizontally on gameboard', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'destroyer') };
  shipData.row = 5;
  shipData.col = 6;
  shipData.orientation = 'horizontal';
  gameboard.placeShip(gameboard, shipData);
  let board = gameboard.getBoard();
  expect(board[5][6]).not.toBeNull();
  expect(board[5][7]).not.toBeNull();
});

test('place carrier vertically on gameboard', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'carrier') };
  shipData.row = 5;
  shipData.col = 5;
  shipData.orientation = 'horizontal';
  gameboard.placeShip(gameboard, shipData);
  let board = gameboard.getBoard();

  for (let i = shipData.col - 1; i < shipData.length + shipData.col; i++) {
    expect(board[shipData.row][i]).not.toBeNull();
  }
});

test('place ship out of bounds on gameboard', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'carrier') };
  shipData.row = 6;
  shipData.col = 6;
  shipData.orientation = 'horizontal';
  gameboard.placeShip(gameboard, shipData);
  let board = gameboard.getBoard();
  expect(board[6][6]).toBeNull();
});
