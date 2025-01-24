import MinusIcon from "../icons/MinusIcon";
// import TrashIcon from "../icons/TrashIcon";
import { Task, Id } from "../types";
import { useState, useEffect, useRef } from "react";


interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
    setMouseIsOver(false);
  };

  useEffect(() => {
    if (editMode && textAreaRef.current) {
      const length = task.content.length;
      textAreaRef.current.focus(); // ensure textarea focus
      textAreaRef.current.setSelectionRange(length, length);
    }
  },[editMode, task.content])

  // return alternate view if editMode = true
  if (editMode) {
    return  (
      <div
        className="relative cursor-grab flex text-left items-center bg-[#0D1117] h-[100px] min-h-[100px] p-2.5 rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
      >
        <textarea
          ref={textAreaRef}
          className="task h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none" 
          value={task.content}
          autoFocus
          placeholder="Task content here..."
          onBlur={toggleEditMode}
          // onKeyDown={(e) => {
          //   if(e.key === "Enter") toggleEditMode()
          // }} 
          onKeyDown={(e) => {
            if(e.key === "Enter" && e.shiftKey) toggleEditMode()
          }} 
          onChange={(e) => {
            updateTask(task.id, e.target.value)
          }}
        >
        </textarea>
      </div>
    )
  }

  return (
    <div
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
          // className="absolute right-4 top-1/2-translate-y-1/2 cursor-pointer p-2 rounded-full text-gray-500 hover:text-rose-500 hover:bg-[#161C22] opacity-60 hover:opacity-100"
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
