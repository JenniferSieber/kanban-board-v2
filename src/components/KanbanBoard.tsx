import { Column, Id, Task } from "../types";
import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const generateId = () => Math.floor(Math.random() * 10001)
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Dragging logic: sensors to identify different actions 
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // starts at 3px
      },
    })
  );

  // Column Functionality
  function createNewColumn() {
    const randomId = generateId();
    const columnToAdd: Column = {
      id: randomId,
      title: `column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function updateColumn(id: Id, title: string) {
    console.log(id, title);
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return; // drag not over valid element
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

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return; // drag not over valid element
    const activeTaskId = active.id;
    const overTaskId = over.id;
    if (activeTaskId === overTaskId) return; // same task
    const isActiveTask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if(!isActiveTask) return;

    // Dropping Task over another Task - swap tasks
    if (isActiveTask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeTaskId);
        const overIndex = tasks.findIndex(t => t.id === overTaskId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    };

    // Dropping Task over a Column empty space not on task
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeTaskId);
        tasks[activeIndex].columnId = overTaskId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    };
  };

  // Task Functionality
  function createTask(columnId: Id) {
    const randomId = generateId();
    const newTask: Task = {
      id: randomId,
      columnId,
      // content: `Task ${tasks.length + 1}`
      content: `Task Id: ${randomId}`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      const updatedTask = { ...task, content };
      return updatedTask;
    });
    setTasks(newTasks);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
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
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
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
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard 
                key={activeTask.id}
                task={activeTask} 
                deleteTask={deleteTask} 
                updateTask={updateTask} 
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
