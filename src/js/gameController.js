import createGameboardGrid from './DOM/createGameboardGrid';
import renderShipsOnGameBoard from './DOM/renderShipsOnGameboard';
import addMarker from './DOM/addMarkerOnGameboard';
import Gameboard from './factories/Gameboard';
import Player from './factories/Player';
import { playExplosionSound, playMissSound } from '../audio/audioUtils';
import clearGameboardDOM from './DOM/clearGameboardDOM';

const FADE_OUT_EFFECT = 'fade-out';
let enemyAttackTime = 1500;
let enemyTimeoutIds = [];

const playerBoard = Gameboard();
const enemyBoard = Gameboard();

const player = Player(playerBoard);
const enemy = Player(enemyBoard);

const gameState = {
  playerBoard: playerBoard,
  enemyBoard: enemyBoard,
  player: player,
  enemy: enemy,
  winner: null,
  currentPlayer: null,
  switchPlayer() {
    if (this.currentPlayer === this.player) {
      this.currentPlayer = this.enemy;
    } else if (this.currentPlayer === this.enemy) {
      this.currentPlayer = this.player;
    }
  },
  gameOver: false,
};

export function firstLoadSetUp() {
  let randomBoard = document.querySelector('.random-board-button');
  randomBoard.addEventListener('click', () => {
    clearGameboardDOM('player-board');
    gameState.playerBoard.clearBoard();
    gameState.playerBoard.removeAllShips();
    gameState.playerBoard.placeShipsRandomly();
    renderShipsOnGameBoard(gameState.playerBoard, 'player-board');
  });

  let startGameButton = document.querySelector('.start-game-button');
  startGameButton.addEventListener('click', startGame);

  let messageInfo = document.querySelector('.message-info');
  messageInfo.addEventListener('animationend', (e) => {
    emptyMessage();
    messageInfo.classList.remove(FADE_OUT_EFFECT);
  });

  createGameboardGrid(gameState.playerBoard, 'player-board', 'player-cell');
  createGameboardGrid(gameState.enemyBoard, 'enemy-board', 'enemy-cell');
  gameState.playerBoard.placeShipsRandomly();
  renderShipsOnGameBoard(gameState.playerBoard, 'player-board');
}

function startGame() {
  let turnStart = Math.round(Math.random());
  gameState.currentPlayer = gameState.player;
  if (turnStart === 0) {
    gameState.currentPlayer = gameState.player;
    toggleGameboardOpacity('.player-side .board-container');
  } else {
    gameState.currentPlayer = gameState.enemy;
    toggleGameboardOpacity('.enemy-side .board-container');
    enemyTimeoutIds.push(setTimeout(enemyAttack, enemyAttackTime));
  }
  changeMessage('Game Start!', FADE_OUT_EFFECT);
  gameState.enemyBoard.removeAllShips();
  gameState.enemyBoard.placeShipsRandomly();
  // renderShipsOnGameBoard(gameState.enemyBoard, 'enemy-board');

  activateEnemyCells();
  // gameState.playerBoard.displayBoard();

  let enemyBoardDOM = document.querySelector('.enemy-board');
  enemyBoardDOM.classList.remove('game-not-started');

  let startGameButton = document.querySelector('.start-game-button');
  startGameButton.classList.add('game-started');

  let randomBoardButton = document.querySelector('button.random-board-button');
  randomBoardButton.classList.add('game-started');

  let resetGameButton = document.querySelector('button.reset-game-button');
  resetGameButton.classList.add('game-started');
  resetGameButton.addEventListener('click', resetGame);
}

function changeMessage(message, effectClass) {
  let messageInfo = document.querySelector('.message-info');
  messageInfo.textContent = message;
  if (effectClass !== undefined) {
    messageInfo.classList.add(FADE_OUT_EFFECT);
  }
}

function enemyAttack() {
  let remainingHits = gameState.enemy.getRemainingAvailableHits();
  let randomIndex = Math.floor(Math.random() * remainingHits.length);
  let { row, col } = remainingHits.splice(randomIndex, 1)[0];
  gameState.enemy.attack(gameState.player, row, col);
  if (gameState.playerBoard.cellHitInfo(row, col) === 'hit') {
    addMarker(gameState.playerBoard, 'player-board', row, col, 'hit');
    playExplosionSound();
    if (playerHasWon(gameState.enemy)) {
      handleGameEnd();
      return;
    }
    enemyTimeoutIds.push(setTimeout(enemyAttack, enemyAttackTime));
  } else if (gameState.playerBoard.cellHitInfo(row, col) === 'miss') {
    playMissSound();
    addMarker(gameState.playerBoard, 'player-board', row, col, 'miss');
    gameState.switchPlayer();
    toggleGameboardOpacity('.player-side .board-container');
    toggleGameboardOpacity('.enemy-side .board-container');
  }
}

function activateEnemyCells() {
  const enemyBoard = document.querySelector('.enemy-board');
  enemyBoard.addEventListener('click', attackEnemy);
}

function attackEnemy(e) {
  if (playerHasWon(gameState.player)) {
    return;
  }
  let cell = e.target;
  if (cell.classList.contains('enemy-cell')) {
    let row = Number(cell.dataset.row);
    let col = Number(cell.dataset.col);
    if (gameState.currentPlayer === gameState.player && !gameState.gameOver && gameState.player.hasAvailableHit(row, col)) {
      gameState.player.attack(gameState.enemy, row, col);
      cell.classList.add('hit');
      if (gameState.enemyBoard.cellHitInfo(row, col) === 'hit') {
        playExplosionSound();
        addMarker(gameState.enemyBoard, 'enemy-board', row, col, 'hit');
        let hitShip = gameState.enemyBoard.getBoard()[row][col];
        if (hitShip.isSunk()) {
          revealShip(hitShip);
        }
        if (playerHasWon(gameState.player)) {
          handleGameEnd();
          return;
        }
      } else if (gameState.enemyBoard.cellHitInfo(row, col) === 'miss') {
        playMissSound();
        addMarker(gameState.enemyBoard, 'enemy-board', row, col, 'miss');
        gameState.switchPlayer();
        toggleGameboardOpacity('.player-side .board-container');
        toggleGameboardOpacity('.enemy-side .board-container');
        enemyTimeoutIds.push(setTimeout(enemyAttack, enemyAttackTime));
      }
    }
  }
}

function playerHasWon(player) {
  let opponentGameboard = player === gameState.player ? gameState.enemyBoard : gameState.playerBoard;
  let allEnemyShipsSunk = opponentGameboard.allShipsSunk();
  if (allEnemyShipsSunk) {
    gameState.winner = player;
  }
  return allEnemyShipsSunk;
}

function handleGameEnd() {
  const enemyBoard = document.querySelector('.enemy-board');
  enemyBoard.removeEventListener('click', attackEnemy);

  if (gameState.winner === gameState.player) {
    changeMessage('You Win!');
  } else if (gameState.winner === gameState.enemy) {
    changeMessage('You Lose!');
  }
}

function resetGame() {
  enemyTimeoutIds.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  enemyTimeoutIds.length = 0;
  gameState.winner = null;
  gameState.gameOver = false;
  gameState.currentPlayer = null;

  // the same board is used for player
  let playerShips = gameState.playerBoard.getShips();
  playerShips.forEach((ship) => {
    ship.resetHits();
  });
  gameState.playerBoard.resetBoardHits();
  gameState.player.resetAvailableHits();

  gameState.enemyBoard.clearBoard();
  gameState.enemyBoard.resetBoardHits();
  gameState.enemy.resetAvailableHits();
  clearGameboardDOM('player-board');
  renderShipsOnGameBoard(gameState.playerBoard, 'player-board');
  // gameState.enemyBoard.placeShipsRandomly();
  // gameState.playerBoard.displayBoard();
  clearGameboardDOM('enemy-board');
  let enemyBoardDOM = document.querySelector('.enemy-board');
  enemyBoardDOM.classList.add('game-not-started');

  let startGameButton = document.querySelector('.start-game-button');
  startGameButton.classList.remove('game-started');

  let randomBoardButton = document.querySelector('button.random-board-button');
  randomBoardButton.classList.remove('game-started');

  let resetGameButton = document.querySelector('button.reset-game-button');
  resetGameButton.classList.remove('game-started');

  let boardContainers = document.querySelectorAll('.board-container');
  boardContainers.forEach((boardContainer) => {
    boardContainer.classList.remove('not-current-turn');
  });
  emptyMessage();
}

function emptyMessage() {
  let messageInfo = document.querySelector('.message-info');
  messageInfo.textContent = '\xa0';
  messageInfo.classList.remove(FADE_OUT_EFFECT);
}

function toggleGameboardOpacity(boardContainerClass) {
  let gameboard = document.querySelector(`${boardContainerClass}`);

  if (gameboard) {
    gameboard.classList.toggle('not-current-turn');
  }
}

function revealShip(ship) {
  let shipPositions = ship.getPositions();
  for (let i = 0; i < shipPositions.length; i++) {
    let cell = document.querySelector(`.enemy-cell[data-row="${shipPositions[i].row}"][data-col="${shipPositions[i].col}"]`);
    cell.dataset.shipName = ship.name;
  }
}
