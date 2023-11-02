import ShipData from '../data/ShipData';
import Player from '../js/factories/Player';
import Gameboard from '../js/factories/Gameboard';
import Ship from '../js/factories/Ship';

let player;
let playerGameboard;
let enemy;
let enemyGameboard;

beforeEach(() => {
  playerGameboard = Gameboard();
  enemyGameboard = Gameboard();
  player = Player(playerGameboard);
  enemy = Player(enemyGameboard);
});

describe('player attacks enemy', () => {
  let shipData;
  let carrier;
  beforeEach(() => {
    shipData = { ...ShipData.find((item) => item.name === 'carrier') };
    shipData.row = 5;
    shipData.col = 0;
    shipData.orientation = 'horizontal';
    carrier = Ship(shipData.name, shipData.length);
    enemyGameboard.placeShip(carrier, shipData);
  });
  test('and cannot attack that cell again', () => {
    expect(player.hasAvailableHit(2, 7)).toBeTruthy();
    expect(player.attack(enemy, 2, 7)).toBeTruthy();
    expect(player.hasAvailableHit(2, 7)).toBeFalsy();
    expect(player.attack(enemy, 2, 7)).toBeFalsy();
  });
  test('and misses', () => {
    player.attack(enemy, 2, 7);
    let hitinfo = enemyGameboard.cellHitInfo(2, 7);
    expect(hitinfo).toBe('miss');
  });
  test('and hits', () => {
    player.attack(enemy, 5, 3);
    let hitinfo = enemyGameboard.cellHitInfo(5, 3);
    expect(hitinfo).toBe('hit');
  });
});
