function Player(gameboard) {
  let availableHits = Array(gameboard.getSize())
    .fill()
    .map(() => Array(gameboard.getSize()).fill(true));

  return {
    gameboard,
    attack(player, row, col) {
      if (this.hasAvailableHit(row, col)) {
        let enemyGameboard = player.gameboard;
        enemyGameboard.receiveAttack(row, col);
        availableHits[row][col] = false;
      }
    },
    hasAvailableHit(row, col) {
      return availableHits[row][col];
    },
    getRemainingAvailableHits() {
      let remainingHits = [];
      for (let row = 0; row < availableHits.length; row++) {
        for (let col = 0; col < availableHits.length; col++) {
          if (this.hasAvailableHit(row, col)) remainingHits.push({ row, col });
        }
      }
      return remainingHits;
    },
    resetAvailableHits() {
      let gameboardSize = this.gameboard.getSize();
      for (let row = 0; row < gameboardSize; row++) {
        for (let col = 0; col < gameboardSize; col++) {
          availableHits[row][col] = true;
        }
      }
    },
  };
}

export default Player;
