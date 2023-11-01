function createGameboardGrid(gameboard, gameboardClass, playerClass) {
  let gameboardSize = gameboard.getSize();
  // console.log(gameboardClass);
  let selectedGameboard = document.querySelector(`.${gameboardClass}`);
  // console.log(selectedGameboard);
  for (let row = 0; row < gameboardSize; row++) {
    for (let col = 0; col < gameboardSize; col++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add(playerClass);
      cell.dataset.row = row;
      cell.dataset.col = col;
      selectedGameboard.appendChild(cell);
    }
  }
}

export default createGameboardGrid;
