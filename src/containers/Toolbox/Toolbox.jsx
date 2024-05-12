import React from "react";
import Line from "../../components/Line/Line";
import "./toolbox.css";

function Toolbox({ lineSelected, setLineSelected }) {
  console.log("Rendering toolbox");
  const handleLineClick = () => setLineSelected(true);
  return (
    <div className="tool-box">
      <Line
        x1={100}
        y1={100}
        x2={500}
        y2={100}
        onClick={handleLineClick}
        color={lineSelected ? "blue" : "black"}
      />
    </div>
  );
}

export default Toolbox;
