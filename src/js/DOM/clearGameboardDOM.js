function clearGameboardDOM(gameboardClass) {
  let gameboardDOM = document.querySelector(`.${gameboardClass}`);
  let allCells = gameboardDOM.querySelectorAll('.cell');

  allCells.forEach((cell) => {
    if (cell.hasAttribute('data-ship-name')) {
      delete cell.dataset.shipName;
    }
    // let hitMarker = cell.querySelector('.hit-marker');

    // if (hitMarker) {
    //   hitMarker.remove();
    // }
  });
}

export default clearGameboardDOM;
