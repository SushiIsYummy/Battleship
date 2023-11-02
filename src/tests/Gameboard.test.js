import Gameboard from '../js/factories/Gameboard.js';
import ShipData from '../data/ShipData.js';
import Ship from '../js/factories/Ship.js';

let gameboard;

beforeEach(() => {
  gameboard = Gameboard();
});

test('place destroyer horizontally on gameboard', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'destroyer') };
  shipData.row = 5;
  shipData.col = 6;
  shipData.orientation = 'horizontal';
  let destroyer = Ship(shipData.name, shipData.length);
  gameboard.placeShip(destroyer, shipData);
  let board = gameboard.getBoard();
  expect(board[5][6]).not.toBeNull();
  expect(board[5][7]).not.toBeNull();
});

test('place carrier vertically on gameboard', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'carrier') };
  shipData.row = 5;
  shipData.col = 5;
  shipData.orientation = 'vertical';
  let carrier = Ship(shipData.name, shipData.length);
  gameboard.placeShip(carrier, shipData);
  let board = gameboard.getBoard();

  for (let i = shipData.row; i < shipData.length + shipData.row; i++) {
    expect(board[i][shipData.col]).not.toBeNull();
  }
});

test('place ship out of bounds on gameboard', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'carrier') };
  shipData.row = 6;
  shipData.col = 6;
  shipData.orientation = 'horizontal';
  let carrier = Ship(shipData.name, shipData.length);
  gameboard.placeShip(carrier, shipData);
  let board = gameboard.getBoard();
  expect(board[6][6]).toBeNull();
});

test('place ship out of bounds on gameboard 2', () => {
  let shipData = { ...ShipData.find((item) => item.name === 'carrier') };
  shipData.row = 8;
  shipData.col = 4;
  shipData.orientation = 'vertical';
  let carrier = Ship(shipData.name, shipData.length);
  gameboard.placeShip(carrier, shipData);
  let board = gameboard.getBoard();
  expect(board[8][4]).toBeNull();
});

test('place ship on an occupied space', () => {
  let cruiserShipData = { ...ShipData.find((item) => item.name === 'cruiser') };
  cruiserShipData.row = 4;
  cruiserShipData.col = 4;
  cruiserShipData.orientation = 'horizontal';
  let carrierShipData = { ...ShipData.find((item) => item.name === 'carrier') };
  carrierShipData.row = 4;
  carrierShipData.col = 4;
  carrierShipData.orientation = 'vertical';
  let carrier = Ship(carrierShipData.name, carrierShipData.length);
  let cruiser = Ship(cruiserShipData.name, cruiserShipData.length);
  let placedCarrier = gameboard.placeShip(carrier, carrierShipData);
  expect(placedCarrier).toBeTruthy();
  let placedCruiser = gameboard.placeShip(cruiser, cruiserShipData);
  expect(placedCruiser).toBeFalsy();
});
