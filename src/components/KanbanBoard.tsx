import { Column, Id } from "../types";
import { useEffect, useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  function generateId() {
    const randomNumber = Math.floor(Math.random() * 10001);
    return randomNumber;
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  useEffect(() => {
    console.log("useEffect Columns:", columns);
  }, [columns]);
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext>
        <div className="m-auto flex flex-col gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={() => deleteColumn(col.id)}
                />
              ))}
            </SortableContext>
          </div>

          {/* <div className="m-auto"> */}
          <button
            className="flex justify-center gap-3 h-[60px] w-[350px] m-w-[350px] p-4 border-2 rounded-lg cursor-pointer mainBGColor  border-[#161C22] ring-rose-500 hover:ring-2"
            onClick={() => createNewColumn()}
          >
            <PlusIcon /> Add Column
          </button>
          {/* </div> */}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
