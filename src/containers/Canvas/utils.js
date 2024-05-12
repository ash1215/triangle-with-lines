export const CONSTANTS = {
  GRID_UNIT: 5,
  CANVAS_WIDTH: 500,
  CANVAS_HEIGHT: 500,
  ARC_RADIUS: 25,
  PROXIMITY_FACTOR: 2,
};

export const isPointCloseToVertex = (x, y, vertex) => {
  if (!x || !y || !vertex) return false;
  return (
    Math.abs(x - vertex.x) <= CONSTANTS.GRID_UNIT * PROXIMITY_FACTOR &&
    Math.abs(y - vertex.y) <= CONSTANTS.GRID_UNIT * PROXIMITY_FACTOR
  );
};

export const findNearestVertex = (x, y, vertices) => {
  for (let i = 0; i < vertices.length; i++) {
    if (isPointCloseToVertex(x, y, vertices[i])) {
      return vertices[i];
    }
  }
  return null;
};

export const getAdjacentLinesToVertex = (vertex, lines) => {
  const adjacentLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i][0].label === vertex.label ||
      lines[i][1].label === vertex.label
    ) {
      adjacentLines.push(lines[i]);
      if (adjacentLines.length === 2) {
        return adjacentLines;
      }
    }
  }
  return adjacentLines;
};

export const getEuclideanDistance = (x1, y1, x2, y2) =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export const getLineLength = (line) => {
  const [x1, y1] = [line[0].x, line[0].y];
  const [x2, y2] = [line[1].x, line[1].y];
  return getEuclideanDistance(x1, y1, x2, y2);
};

export const isLeftVertex = (vertex, line) => {
  const secondVertex = line[0].label === vertex.label ? line[1] : line[0];
  return vertex.x < secondVertex.x;
};

export const getAngle = (line, vertex) => {
  let angle = Math.atan((line[0].y - line[1].y) / (line[0].x - line[1].x));
  if (!isLeftVertex(vertex, line)) angle += Math.PI;
  return angle;
};
