import React, { useRef, useEffect, useState } from "react";
import FlexLayout from "../../components/FlexLayout/FlexLayout";
import {
  getAdjacentLinesToVertex,
  getAngle,
  getEuclideanDistance,
  isPointCloseToVertex,
  getLineLength,
  findNearestVertex,
  CONSTANTS,
} from "./utils";
import "./canvas.css";

function Canvas({ lineSelected, setLineSelected }) {
  const canvasRef = useRef(null);
  const [vertices, setVertices] = useState([]);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [drawingLine, setDrawingLine] = useState(false);
  const [lines, setLines] = useState([]);
  const { GRID_UNIT, CANVAS_WIDTH, CANVAS_HEIGHT, ARC_RADIUS } = CONSTANTS;
  // only for mobile touches
  const [lastTouch, setLastTouch] = useState();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx);

    // Draw lines
    lines.forEach(([start, end]) => drawLine(ctx, start, end));

    // Draw vertices with labels
    vertices.forEach((vertex) => drawVertex(ctx, vertex));
  }, [JSON.stringify(vertices), JSON.stringify(lines)]);

  const drawVertex = (ctx, vertex) => {
    // Draw vertex
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();

    // Draw label
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(vertex.label, vertex.x - 5, vertex.y - 10);

    const adjacentLines = getAdjacentLinesToVertex(vertex, lines);
    adjacentLines.length === 2 && drawAngle(ctx, vertex, ...adjacentLines);
  };

  const drawLine = (ctx, start, end) => {
    // Draw line
    ctx.beginPath();
    const [x1, y1] = [start.x, start.y];
    const [x2, y2] = [end.x, end.y];
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw label
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    const distance = Math.round(
      getEuclideanDistance(x1, y1, x2, y2) / GRID_UNIT
    );
    ctx.fillText(distance, (x1 + x2) / 2 - 5, (y1 + y2) / 2 - 10);
  };

  const drawAngle = (ctx, vertex, line1, line2) => {
    ctx.beginPath();
    const radius = Math.min(
      ARC_RADIUS,
      getLineLength(line1),
      getLineLength(line2)
    );
    const [angle1, angle2] = [getAngle(line1, vertex), getAngle(line2, vertex)];
    let startAngle = angle1;
    let endAngle = angle2;
    if (angle2 < angle1) {
      startAngle = angle2;
      endAngle = angle1;
    }
    if (endAngle - startAngle > Math.PI) {
      [startAngle, endAngle] = [endAngle, startAngle];
    }
    ctx.arc(vertex.x, vertex.y, radius, startAngle, endAngle);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    const midAngle = (startAngle + endAngle) / 2;
    const tan = Math.tan(midAngle);
    const x = 10 / Math.sqrt(Math.pow(tan, 2) + 1);
    const y = x * tan;

    // Draw label
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    let angleValue = ((endAngle - startAngle) * 180) / Math.PI;
    if (angleValue < 0) angleValue += 360;
    ctx.fillText(Math.round(angleValue), vertex.x + x, vertex.y + y);
  };

  const getNewVertex = (x, y) => ({
    x,
    y,
    label: String.fromCharCode(65 + vertices.length),
  });

  const drawGrid = (ctx) => {
    // Draw grid
    ctx.strokeStyle = "#ccc";
    for (let x = GRID_UNIT; x < ctx.canvas.width; x += GRID_UNIT) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    for (let y = GRID_UNIT; y < ctx.canvas.height; y += GRID_UNIT) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const handleCanvasMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const vertex = getNewVertex(x, y);

    if (selectedVertex && drawingLine) {
      // Update line position
      setLines([...lines.slice(0, -1), [selectedVertex, vertex]]);
    }
  };

  const handleCanvasMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nearestVertex = findNearestVertex(x, y, vertices);
    if (!nearestVertex && !lineSelected) {
      alert(
        lines.length === 0
          ? "Select the line segment in the toolbox below to start drawing."
          : "Click on any vertex to start another line or select the line segment from the toolbox."
      );
      return;
    }
    setLineSelected(false);
    if (
      nearestVertex &&
      getAdjacentLinesToVertex(nearestVertex, lines).length === 2
    ) {
      return;
    }
    const vertex = getNewVertex(x, y);

    if (!drawingLine) {
      // Start drawing line
      setSelectedVertex(nearestVertex ?? vertex);
      !nearestVertex && setVertices([...vertices, vertex]);
      setDrawingLine(true);
      setLines([...lines, [vertex, vertex]]);
    }
  };

  const handleCanvasMouseUp = (event) => {
    if (drawingLine) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const currentLinesFirstVertex = lines[lines.length - 1][0];
      const bothVerticesSame = isPointCloseToVertex(
        x,
        y,
        currentLinesFirstVertex
      );
      if (bothVerticesSame) {
        setLines(lines.slice(0, -1));
        setDrawingLine(false);
        return;
      }
      const vertex = getNewVertex(x, y);
      // Stop drawing line
      setDrawingLine(false);
      setVertices([...vertices, vertex]);

      const adjacentLines = getAdjacentLinesToVertex(
        currentLinesFirstVertex,
        lines
      );
      // Complete the triangle
      if (adjacentLines.length === 2) {
        const openVertex = [
          adjacentLines[0][0],
          adjacentLines[0][1],
          adjacentLines[1][0],
          adjacentLines[1][1],
        ].filter(
          (v) =>
            v.label != vertex.label && v.label != currentLinesFirstVertex.label
        )[0];
        setLines([...lines, [openVertex, vertex]]);
      }
    }
  };

  const handleCanvasTouchStart = (event) => {
    event.preventDefault();

    const touch = event.touches[0];
    console.log({ touchstart: touch });
    handleCanvasMouseDown(touch);
  };

  const handleCanvasTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    handleCanvasMouseMove(touch);
    setLastTouch(touch);
  };

  const handleCanvasTouchEnd = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    console.log({ touch });
    handleCanvasMouseUp(lastTouch);
  };

  const handleCanvasTouchCancel = (event) => {
    event.preventDefault();
    handleCanvasMouseUp();
  };

  return (
    <FlexLayout className="canvas" alignItems="center" justifyContent="center">
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onTouchStart={handleCanvasTouchStart}
        onTouchMove={handleCanvasTouchMove}
        onTouchEnd={handleCanvasTouchEnd}
        onTouchCancel={handleCanvasTouchCancel}
      />
    </FlexLayout>
  );
}

export default Canvas;
