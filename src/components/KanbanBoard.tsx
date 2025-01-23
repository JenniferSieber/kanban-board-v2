import { Column, Id } from "../types";
import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
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

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    console.log(event)
    const {active, over} = event;

    if (!over) return; // not dragging over a valid element

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return; // same column
  
    const swappedColumns = (columns: Column[]) => {
      const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)
      const overColumnIndex = columns.findIndex(col => col.id === overColumnId)
      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    }
    setColumns(swappedColumns)
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext 
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
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

          <button
            className="flex justify-center gap-3 h-[60px] w-[350px] m-w-[350px] p-4 border-2 rounded-lg cursor-pointer mainBGColor  border-[#161C22] ring-rose-500 hover:ring-2"
            onClick={() => createNewColumn()}
          >
            <PlusIcon /> Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
