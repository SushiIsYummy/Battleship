function addMarker(gameboard, gameboardClass, row, col, marker) {
  let hitInfo = gameboard.cellHitInfo(row, col);
  let gameboardDOM = document.querySelector(`.${gameboardClass}`);
  let cellDOM = gameboardDOM.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (hitInfo !== false) {
    let hitMarker = createHitMarker();
    hitMarker.classList.add(marker);
    cellDOM.appendChild(hitMarker);
  }
}

function createHitMarker() {
  // Create an SVG element
  let size = 20; // px
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', `${size}`);
  svg.setAttribute('height', `${size}`);
  svg.classList.add('hit-marker');

  // Create a circle element
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', `${size / 2}`);
  circle.setAttribute('cy', `${size / 2}`);
  circle.setAttribute('r', `${size / 2}`);

  // Append the circle to the SVG
  svg.appendChild(circle);
  return svg;
}

export default addMarker;
