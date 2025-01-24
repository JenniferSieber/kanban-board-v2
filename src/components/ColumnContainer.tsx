import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
}

function ColumnContainer({ column, deleteColumn, updateColumn }: Props) {
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
        className="flex flex-col rounded-md columnBGColor opacity-50 border-2 border-rose-700 w-[350px] h-[500px] max-h-[500px] gap-4"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col rounded-md columnBGColor w-[350px] h-[500px] max-h-[500px] gap-4"
    >
      {/* Column Title Container */}
      <header
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className=" flex justify-between items-center rounded-lg rounded-b-none bg-[#0D1117] p-3 font-bold text-md h-[60px] cursor-grab border-[#161C22] border-4"
      >
        <div className="flex  gap-4">
          <span className="columnBGColor flex justify-center items-center px-2 py-1 text-sm rounded-md">
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
        tasks details
      </section>
      <footer className="footer">
        {/* Column Footer Container */}
        footer details
      </footer>
    </div>
  );
}

export default ColumnContainer;
