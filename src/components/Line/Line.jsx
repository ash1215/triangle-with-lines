import React from "react";

const Line = ({ x1, y1, x2, y2, onClick, color, className }) => {
  const dotRadius = 5;
  const lineWidth = 3;

  const viewBoxWidth = Math.max(x1, x2) + Math.max(dotRadius, lineWidth);
  const viewBoxHeight = Math.max(y1, y2) + Math.max(dotRadius, lineWidth);
  return (
    <svg
      width="100%"
      height="100%"
      onClick={onClick}
      className={className}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={lineWidth}
      />
      <circle cx={x1} cy={y1} r={dotRadius} fill="black" />
      <circle cx={x2} cy={y2} r={dotRadius} fill="black" />
    </svg>
  );
};

export default Line;
