import { Column, Id, Task, Member } from "../types";
import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import TitleComponent from "./TitleComponent";
import DatesComponent from "./DatesComponent";
import GenerateProjectOwners from "./GenerateProjectOwners";
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
  const generateId = () => Math.floor(Math.random() * 10001);
  const [projectName, setProjectName] = useState<string>("Project Name");
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [projectOwners, setProjectOwners] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState<string>("");

  // Project Owners Input Logic
  function updateProjectOwners(newMemberName: string) {
    const randomId = generateId();
    const newProjectMember = { id: randomId, memberName: newMemberName };

    if (newProjectMember.memberName !== "")
      setNewMemberName(newProjectMember.memberName);
    setProjectOwners([...projectOwners, newProjectMember]);
  }

  // Project Owners remove Member
  function reduceProjectOwners(id: Id) {
    const updatedProjectMembers = projectOwners.filter(user => user.id !== id)
    setProjectOwners(updatedProjectMembers);
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log("Selected Date in Main Component:", date);
  };

  // Dragging logic: sensors to identify different actions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // starts at 5px
      },
    })
  );
  
  // Project Title
  function updateProjectTitle(name: string) {
    if (/^[a-zA-Z '-]+$/.test(name.trim()) && name.trim() !== "") {
      setProjectName(name.trim());
      console.log(name.trim())
    } else {
      alert(`${name} is invalid. Please try again.`);
    }
  }
  
  // Column Functionality
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
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
      content: "Task Title",
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
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="h-[100px] bg-[#161C22] p-4 text-white flex justify-between items-center ">
      
        <TitleComponent
          updateProjectTitle={() => updateProjectTitle(projectName)}
        />
        <div className="date-box flex flex-col">
          <DatesComponent
            heading="Deadline"
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            handleDateChange={handleDateChange}
          />
        </div>
      </header>
      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Aside - (Left Sidebar) */}
        <aside className="w-1/3 min-w-[200px] max-w-[300px] bg-[#0D1117] p-4 text-white">
          <GenerateProjectOwners
            newMemberName={newMemberName}
            setNewMemberName={setNewMemberName}
            projectOwners={projectOwners}
            updateProjectOwners={updateProjectOwners}
            reduceProjectOwners={reduceProjectOwners}
          />
        </aside>
        {/* Tasks Container (Right Section) */}
        <main className="w-2/3 bg-[#1A202C] p-4 text-white overflow-y-auto">
          <button
            className="flex justify-center gap-3 h-[60px] w-[250px] m-w-[350px] p-4 border-2 rounded-lg cursor-pointer bg-[#0D1117]  border-[#161C22] hover:text-rose-500 hover:border-rose-500 hover:bg-black"
            onClick={() => createNewColumn()}
          >
            <PlusIcon /> Add Task Column
          </button>
          <div className="project-details">Soon to be Project Details</div>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="mt-4 flex space-x-4">
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
            </div>
          </DndContext>
        </main>
      </div>
    </div>
  );
}

export default KanbanBoard;
