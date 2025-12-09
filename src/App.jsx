import { useState } from "react";
import "./App.css";
import TamagotchiGame from "./TamagotchiGame";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TamagotchiGame />
    </>
  );
}

export default App;
