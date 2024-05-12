import React, { useState } from "react";
import Toolbox from "./containers/Toolbox/Toolbox";
import Canvas from "./containers/Canvas/Canvas";
import FlexLayout from "./components/FlexLayout/FlexLayout";

function App() {
  const [lineSelected, setLineSelected] = useState(false);
  return (
    <FlexLayout direction="column" margin={0} padding={0}>
      <Canvas lineSelected={lineSelected} setLineSelected={setLineSelected} />
      <Toolbox lineSelected={lineSelected} setLineSelected={setLineSelected} />
    </FlexLayout>
  );
}

export default App;
