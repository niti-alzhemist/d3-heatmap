import "./App.css";
import React, { useState } from "react";
import { Heatmap } from "./Heatmap.tsx";

function App() {
  const [counter, setCounter] = useState(1);

  const handleCounter = () => setCounter((prevState) => (prevState += 1));
  return (
    <div>
      <div>{counter}</div>
      <button onClick={handleCounter}>
        <div> Click me</div>
      </button>

      <Heatmap width={700} height={700} />
    </div>
  );
}

export default App;
