function Ship(name, length) {
  let hits = 0;
  let positions = [];
  return {
    name,
    length,
    hit(row, col) {
      positions.push({ row, col });
      hits++;
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
  };
}

export default Ship;
