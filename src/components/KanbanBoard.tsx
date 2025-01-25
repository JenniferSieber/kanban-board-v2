import { Column, Id, Task } from "../types";
import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import Title from "./Title";
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
import DateSetter from "./DateSetter";

function KanbanBoard() {
  const [projectName, setProjectName] = useState<string>("Project Name");
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log("Selected Date in Main Component:", date);
  };

  const generateId = () => Math.floor(Math.random() * 10001);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Dragging logic: sensors to identify different actions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // starts at 10px
      },
    })
  );

  // Project Title
  function updateProjectTitle(name: string) {
    if (name !== projectName) {
      setProjectName(name);
    }
  }
  // Column Functionality
  function createNewColumn() {
    const randomId = generateId();
    const columnToAdd: Column = {
      id: randomId,
      //   title: `column ${randomId}`,
      title: "Column Title",
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function updateColumn(id: Id, title: string) {
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
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return; // drag not over valid element
    const activeTaskId = active.id;
    const overTaskId = over.id;
    if (activeTaskId === overTaskId) return; // same task
    const isActiveTask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (!isActiveTask) return;

    // Dropping Task over another Task - swap tasks
    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
        const overIndex = tasks.findIndex((t) => t.id === overTaskId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping Task over a Column empty space not on task
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
        tasks[activeIndex].columnId = overTaskId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

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
    <main className="kanban-board m-10 m-w-[800px]">
      <div className="rounded-md h-[170px] bg-[#161C22] flex flex-col gap-5 p-2">
        <div className="title-date flex justify-between p-2">
          <Title
            projectName={projectName}
            updateProjectTitle={updateProjectTitle}
          />
          <DateSetter
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
        <button
          className="flex justify-center gap-3 h-[60px] w-[350px] m-w-[350px] p-4 border-2 rounded-lg cursor-pointer bg-[#0D1117]  border-[#161C22] ring-rose-500 hover:ring-2"
          onClick={() => createNewColumn()}
        >
          <PlusIcon /> Add Column
        </button>
      </div>

      <div className="m-auto m-h-screen overflow-x-auto overflow-y-hidden flex items-center justify-center w-full">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="py-5">
            <div className="flex flex-wrap justify-center gap-4">
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
    </main>
  );
}

export default KanbanBoard;
