import createGameboardGrid from './DOM/createGameboardGrid';
import { addHitMarker, placeShipsRandomly } from './utils/gameboardUtils';
import renderShipsOnGameBoard from './DOM/renderShipsOnGameboard';
import addMarker from './DOM/addMarkerOnGameboard';
import Gameboard from './factories/Gameboard';
import Player from './factories/Player';

const playerBoard = Gameboard();
const enemyBoard = Gameboard();

const player = Player(playerBoard);
const enemy = Player(enemyBoard);

const gameState = {
  playerBoard: playerBoard,
  enemyBoard: enemyBoard,
  player: player,
  enemy: enemy,
  currentPlayer: null, // Initialize with the player's turn
  switchPlayer() {
    if (this.currentPlayer === this.player) {
      this.currentPlayer = this.enemy;
    } else if (this.currentPlayer === this.enemy) {
      this.currentPlayer = this.player;
    }
  },
  gameOver: false,
};

export function initializeGame() {
  let turnStart = Math.round(Math.random());
  gameState.currentPlayer = gameState.player;
  // if (turnStart === 0) {
  //   gameState.currentPlayer = gameState.player;
  // } else {
  //   gameState.currentPlayer = gameState.enemy;
  // }
  createGameboardGrid(gameState.playerBoard, 'player-board', 'player-cell');
  createGameboardGrid(gameState.enemyBoard, 'enemy-board', 'enemy-cell');
  placeShipsRandomly(gameState.playerBoard);
  placeShipsRandomly(gameState.enemyBoard);
  renderShipsOnGameBoard(gameState.playerBoard, 'player-board');
  activateEnemyCells();
  gameState.playerBoard.displayBoard();
  console.table(gameState.enemyBoard.getBoardHits());
  console.table(gameState.enemyBoard.displayBoard());
  console.table(gameState.enemyBoard.getBoardHits());
}

function enemyAttack() {
  let remainingHits = gameState.enemy.getRemainingAvailableHits();
  let randomIndex = Math.floor(Math.random() * remainingHits.length);
  console.log(randomIndex);
  console.log(remainingHits);
  let { row, col } = remainingHits.splice(randomIndex, 1)[0];
  gameState.enemy.attack(gameState.player, row, col);
  if (gameState.playerBoard.cellHitInfo(row, col) === 'hit') {
    addMarker(gameState.playerBoard, 'player-board', row, col, 'hit');
    console.log('ENEMY HIT!');
    // setTimeout(enemyAttack, 1000);
    enemyAttack();
  } else if (gameState.playerBoard.cellHitInfo(row, col) === 'miss') {
    console.log('ENEMY MISS!');
    addMarker(gameState.playerBoard, 'player-board', row, col, 'miss');
    gameState.switchPlayer();
  }
  console.log('ENEMY ATTACK!');
}

function activateEnemyCells() {
  const enemyBoard = document.querySelector('.enemy-board');

  enemyBoard.addEventListener('click', (e) => {
    if (gameIsWon()) {
      console.log('GAME IS OVER!!!');
      return;
    }
    let cell = e.target;
    if (cell.classList.contains('enemy-cell')) {
      let row = Number(cell.dataset.row);
      let col = Number(cell.dataset.col);
      console.log(`available hit: ${gameState.player.hasAvailableHit(row, col)}`);
      console.log(gameState.currentPlayer === gameState.player);
      if (gameState.currentPlayer === gameState.player && !gameState.gameOver && gameState.player.hasAvailableHit(row, col)) {
        console.log(row, col);
        gameState.player.attack(gameState.enemy, row, col);
        if (gameState.enemyBoard.cellHitInfo(row, col) === 'hit') {
          addMarker(gameState.enemyBoard, 'enemy-board', row, col, 'hit');
          let hitShip = gameState.enemyBoard.getBoard()[row][col];
          console.log(hitShip);
          if (hitShip.isSunk()) {
            revealShip(hitShip);
          }
          if (gameIsWon()) {
            console.log('GAME IS OVER!!!');
            return;
          }
        } else if (gameState.enemyBoard.cellHitInfo(row, col) === 'miss') {
          addMarker(gameState.enemyBoard, 'enemy-board', row, col, 'miss');
          // setTimeout(enemyAttack, 1000);
          enemyAttack();
          gameState.switchPlayer();
        }
      }
    }
  });
}

function gameIsWon() {
  return gameState.playerBoard.allShipsSunk() || gameState.enemyBoard.allShipsSunk();
}

function revealShip(ship) {
  let shipPositions = ship.getPositions();
  for (let i = 0; i < shipPositions.length; i++) {
    console.log(shipPositions[i].row, shipPositions[i].col);
    let cell = document.querySelector(`.enemy-cell[data-row="${shipPositions[i].row}"][data-col="${shipPositions[i].col}"]`);
    cell.dataset.shipName = ship.name;
  }
}
