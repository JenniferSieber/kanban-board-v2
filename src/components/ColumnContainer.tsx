import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import TaskCard from "./TaskCard";
import TrashIcon from "../icons/TrashIcon";
import PlusDocIcon from "../icons/PlusDocIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext } from "@dnd-kit/sortable";
import PriorityIconSelector from "./PriorityIconSelector";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  deleteTask,
  updateTask,
  tasks,
}: ColumnContainerProps) {
  const [editMode, setEditMode] = useState(false);

  // Draggable Logic for a Task
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Render overlay empty frame for task
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col rounded-md bg-[#161C22] w-[300px] max-w-[350px] h-[500px] gap-4 opacity-50 border-2 border-rose-700"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col rounded-md bg-[#161C22] w-[300px] max-w-[350px] h-[500px] gap-1"
    >
      {/* Column Title Container */}
      <header
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="flex h-[60px] bg-[#0D1117] border-[#161C22] border-4 justify-between items-center rounded-lg rounded-b-none font-bold text-md cursor-grab p-2"
      >
        <div className="flex gap-4">
          {!editMode && (
            <span className="text-md capitalize p-2">{column.title}</span>
          )}
          {editMode && (
            <input
              className="bg-black rounded-sm px-2 border-2 focus:border-rose-700 outline-none"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
      </header>
      <PriorityIconSelector />
      {/* Column Task Container */}
      <section className="flex flex-col flex-grow gap-2 p-2 overflow-x-hidden overflow-y-auto">
        {tasks.map((task) => (
          <SortableContext items={tasksIds}>
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          </SortableContext>
        ))}
      </section>

      {/* Column Footer Container */}
      <footer className="flex justify-between items-center">
        <button
          className="cursor-pointer flex justify-end gap-2 rounded-md items-center border-2 border-[#161C22] p-4 m-1 hover:text-sky-500 active:bg-black"
          onClick={() => {
            createTask(column.id);
          }}
        >
          <PlusDocIcon />
          Add Task
        </button>
        <button
          className="cursor-pointer flex justify-end gap-2 rounded-md items-center border-2 border-[#161C22] hover:bg-[#0D1117] p-4 m-1 hover:text-rose-500 active:bg-black hover:border-rose-500 hover:font-bold"
          onClick={() => deleteColumn(column.id)}
        >
          Delete All
          <TrashIcon />
        </button>
      </footer>
    </div>
  );
}

export default ColumnContainer;
