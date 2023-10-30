import ShipData from '../../data/ShipData';
import Ship from '../factories/Ship';

export function placeShipsRandomly(gameboard) {
  ShipData.forEach((shipData) => {
    let ship = Ship(shipData.name, shipData.length);
    let shipDataCopy = { ...shipData };
    do {
      let row = Math.floor(Math.random() * (gameboard.getSize() - 0) + 0);
      let col = Math.floor(Math.random() * (gameboard.getSize() - 0) + 0);
      let orientationBool = Math.round(Math.random());
      let orientation = orientationBool ? 'horizontal' : 'vertical';
      shipDataCopy.row = row;
      shipDataCopy.col = col;
      shipDataCopy.orientation = orientation;
      console.log(shipDataCopy);
    } while (gameboard.placeShip(ship, shipDataCopy) !== true);
  });
}
