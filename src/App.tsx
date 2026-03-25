import { useState, useRef } from "react";
import { useCollaboration } from "./hooks/useCollaboration";
import { useTaskStore } from "./store/taskStore";
import TaskCard from "./components/TaskCard";
import ListView from "./views/ListView";
import TimelineView from "./views/TimelineView";
import FilterBar from "./components/FilterBar";
import type { Status } from "./types/task";

const columns = [
  { title: "To Do", status: "To Do" as const, color: "bg-slate-100", dot: "bg-gray-400" },
  { title: "In Progress", status: "In Progress" as const, color: "bg-blue-50", dot: "bg-blue-400" },
  { title: "In Review", status: "In Review" as const, color: "bg-yellow-50", dot: "bg-yellow-400" },
  { title: "Done", status: "Done" as const, color: "bg-green-50", dot: "bg-green-400" },
];

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const moveTask = useTaskStore((state) => state.moveTask);
  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");
  const [activeFilters, setActiveFilters] = useState<((t: typeof tasks[0]) => boolean) | null>(null);
  const filteredTasks = activeFilters ? tasks.filter(activeFilters) : tasks;
  const taskIds = tasks.map((t) => t.id);
  const activeUsers = useCollaboration(taskIds);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const draggedId = useRef<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Project Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your tasks across all stages</p>
        </div>
        <div className="flex gap-2">
          {(["kanban", "list", "timeline"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                view === v
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Collaboration Bar */}
      <div className="bg-white rounded-xl shadow-sm px-4 py-3 mb-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {activeUsers.map((u) => (
            <div
              key={u.id}
              className={`w-8 h-8 rounded-full ${u.color} text-white text-xs font-bold flex items-center justify-center border-2 border-white`}
            >
              {u.name}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{activeUsers.length} people</span> are viewing this board
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar tasks={tasks} onFilter={(filtered) => {
        if (filtered.length === tasks.length) {
          setActiveFilters(null);
        } else {
          const ids = new Set(filtered.map(t => t.id));
          setActiveFilters(() => (t: typeof tasks[0]) => ids.has(t.id));
        }
      }} />
      {/* Kanban View */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            const isOver = overColumn === col.status;

            return (
              <div
                key={col.status}
                className={`${col.color} rounded-xl p-4 min-w-[270px] w-[270px] flex flex-col transition-all ${
                  isOver ? "ring-2 ring-blue-400 bg-blue-50" : ""
                }`}
                onDragEnter={() => setOverColumn(col.status)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedId.current) {
                    moveTask(draggedId.current, col.status as Status);
                    draggedId.current = null;
                  }
                  setOverColumn(null);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOverColumn(null);
                  }
                }}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${col.dot}`}></div>
                  <h2 className="font-semibold text-gray-700 text-sm">{col.title}</h2>
                  <span className="ml-auto bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="overflow-y-auto max-h-[500px] flex flex-col gap-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-10">
                      <p className="text-2xl mb-2">📭</p>
                      <p>No tasks here</p>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => {
                          draggedId.current = task.id;
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", task.id);
                        }}
                        onDragEnd={() => {
                          draggedId.current = null;
                          setOverColumn(null);
                        }}
                        style={{ cursor: "grab" }}
                      >
                        <TaskCard
                          task={task}
                          viewers={activeUsers
                            .filter((u) => u.taskId === task.id)
                            .map((u) => ({ name: u.name, color: u.color }))}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && <ListView tasks={filteredTasks} />}

      {/* Timeline View */}
      {view === "timeline" && <TimelineView tasks={filteredTasks} />}

    </div>
  );
}

export default App;