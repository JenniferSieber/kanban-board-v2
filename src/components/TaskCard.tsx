import MinusIcon from "../icons/MinusIcon";
// import TrashIcon from "../icons/TrashIcon";
import { Task, Id } from "../types";
import { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Draggable Logic
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Edit Tasks Logic
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (editMode && textAreaRef.current) {
      const length = task.content.length;
      textAreaRef.current.focus(); // ensure textarea focus
      textAreaRef.current.setSelectionRange(length, length);
    }
  }, [editMode, task.content]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  // Render Modes:
  // return frame div if Dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 relative cursor-grab flex text-left items-center bg-[#0D1117] h-[100px] min-h-[100px] p-2.5 rounded-xl border-2 border-rose-500"
      >
        {/* placeholder overlay */}
      </div>
    )
  }

  // return Text area if editing task
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative cursor-grab flex text-left items-center bg-[#0D1117] h-[100px] min-h-[100px] p-2.5 rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
      >
        <textarea
          ref={textAreaRef}
          className="task h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value);
          }}
        ></textarea>
      </div>
    );
  }

  // return normal task card view
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="task relative cursor-grab flex text-left items-center bg-[#0D1117] h-[100px] min-h-[100px] p-2.5 rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="task h-[90%] w-full my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap outline-none">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          className="absolute right-4 top-1/2-translate-y-1/2 cursor-pointer p-2 rounded-full text-gray-500 hover:text-rose-500"
          onClick={() => deleteTask(task.id)}
        >
          <MinusIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
