import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import PlusDocIcon from "../icons/PlusDocIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  task: Task;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
}

function ColumnContainer({ column, deleteColumn, updateColumn, createTask, tasks }: Props) {
  const [editMode, setEditMode] = useState(false);
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
  
  

  // Style for transform and transition
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    // render empty frame of location during isDragging
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col rounded-md bg-[#161C22] opacity-50 border-2 border-rose-700 w-[350px] h-[500px] max-h-[500px] gap-4"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col rounded-md bg-[#161C22] w-[350px] h-[500px] max-h-[500px] gap-4"
    >
      {/* Column Title Container */}
      <header
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className=" flex justify-between items-center rounded-lg rounded-b-none bg-[#0D1117] p-3 font-bold text-md h-[60px] cursor-grab border-[#161C22] border-4"
      >
        <div className="flex  gap-4">
          <span className="bg-[#161C22] flex justify-center items-center px-2 py-1 text-sm rounded-md">
            20
          </span>
          {!editMode && <span className="text-md capitalize p-2">{column.title}</span>}
          {editMode && (
            <input
              className="bg-black rounded-sm px-2 border-2 focus:border-rose-700 outline-none"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus 
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return
                setEditMode(false)
              }}
            />
          )}
        </div>
        <button
          className="delete cursor-pointer p-2 rounded-full text-gray-500 hover:text-rose-500 hover:bg-[#161C22]"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </header>
      <section className="flex flex-grow">
        {/* Column Task Container */}
        {tasks.map(task => (
          <div className="task" key={task.id}>{task.content}</div>
        ))}
      </section>
      {/* Column Footer Container */}
      <button 
        className="flex justify-end gap-2 rounded-md items-center border-2 border-[#161C22]  py-4 hover:bg-[#0D1117] p-4 m-1 hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusDocIcon />Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
