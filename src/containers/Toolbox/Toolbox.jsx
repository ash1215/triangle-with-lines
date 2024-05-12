import React from "react";
import Line from "../../components/Line/Line";
import "./toolbox.css";

function Toolbox({ lineSelected, setLineSelected }) {
  const handleLineClick = () => setLineSelected(true);
  let x2 = 500;
  const screenWidth = window.innerWidth;
  if(screenWidth-100 < 500) {
    x2 = screenWidth - 100;
  }
  console.log({screenWidth, x2})
  return (
    <div className="tool-box">
      <Line
        x1={100}
        y1={100}
        x2={x2}
        y2={100}
        onClick={handleLineClick}
        color={lineSelected ? "blue" : "black"}
      />
    </div>
  );
}

export default Toolbox;
