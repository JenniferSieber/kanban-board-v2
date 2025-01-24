import { Column, Id, Task } from "../types";
import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
// ts 39 tasks

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // sensors for delete column container vs drag column container
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // starts at 3px
      },
    })
  );

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

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  function updateColumn(id: Id, title: string) {
    console.log(id, title);
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`
    }
    setTasks([...tasks, newTask]);
  };

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return; // not dragging over a valid element

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return; // same column

    const swappedColumns = (columns: Column[]) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    };
    setColumns(swappedColumns);
  };



  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
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
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter(task => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>

          <button
            className="flex justify-center gap-3 h-[60px] w-[350px] m-w-[350px] p-4 border-2 rounded-lg cursor-pointer bg-[#0D1117]  border-[#161C22] ring-rose-500 hover:ring-2"
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
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(task => task.columnId === activeColumn.id)}
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
