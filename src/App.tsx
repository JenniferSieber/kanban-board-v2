import { useState } from "react";
import "./App.css";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <KanbanBoard />
      </div>
    </>
  );
}

export default App;
