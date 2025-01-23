import { Column } from "../types"; 
import { useEffect, useState } from "react";
import PlusIcon from "../icons/PlusIcon";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

  function generateId() {
    // generate random number between 0 - 10,000
    const randomNumber = Math.floor(Math.random() * 10001)
    return randomNumber;
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length+1}`,
    };
    setColumns([...columns, columnToAdd]) 
  }

  useEffect(() => {
    console.log('useEffect Columns:', columns)
  }, [columns])
  return (
    <div className="flex m-auto min-h-screen items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="columndisplay">
        {columns.map((col) => <div key={col.id}>{col.title}</div> )}
      </div>
      <div className="m-auto">
        <button
          className="flex justify-center gap-3 h-[60px] w-[350px] m-w-[350px] p-4 border-2 rounded-lg cursor-pointer mainBGColor borderColor ring-rose-500 hover:ring-2"
          onClick={() => createNewColumn()}
        >
          <PlusIcon /> Add Column
        </button>
      </div>
    </div>
  );
}

export default KanbanBoard;
