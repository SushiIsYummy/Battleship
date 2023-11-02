import Ship from '../js/factories/Ship';
import ShipData from '../data/ShipData';

test('ship is sunk', () => {
  let ship = Ship('battleship', 4);
  for (let i = 0; i < ship.length; i++) {
    ship.hit();
  }
  expect(ship.isSunk()).toBeTruthy();
});

test('ship is hit but not sunk', () => {
  let ship = Ship('cruiser', 3);
  for (let i = 0; i < ship.length - 1; i++) {
    ship.hit();
  }
  expect(ship.isSunk()).toBeFalsy();
});

test('all parts of a ship is hit and is sunk', () => {
  let ship = Ship('cruiser', 3);
  for (let i = 0; i < ship.length; i++) {
    ship.hit();
  }
  expect(ship.isSunk()).toBeTruthy();
});
