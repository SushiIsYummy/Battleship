function Ship(name, length) {
  let hits = 0;
  let positions = [];
  return {
    name,
    length,
    hit() {
      hits++;
    },
    resetHits() {
      hits = 0;
    },
    isSunk() {
      if (hits >= this.length) {
        return true;
      }
      return false;
    },
    getPositions() {
      return JSON.parse(JSON.stringify(positions));
    },
    addPosition(row, col) {
      if (positions.length >= this.length) {
        return;
      }
      positions.push({ row, col });
    },
  };
}

export default Ship;
