import { useState } from "react";
import { useCollaboration } from "./hooks/useCollaboration";
import { useTaskStore } from "./store/taskStore";
import TaskCard from "./components/TaskCard";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import ListView from "./views/ListView";
import TimelineView from "./views/TimelineView";
import FilterBar from "./components/FilterBar";

const columns = [
  { title: "To Do", status: "To Do" as const, color: "bg-slate-100", dot: "bg-gray-400" },
  { title: "In Progress", status: "In Progress" as const, color: "bg-blue-50", dot: "bg-blue-400" },
  { title: "In Review", status: "In Review" as const, color: "bg-yellow-50", dot: "bg-yellow-400" },
  { title: "Done", status: "Done" as const, color: "bg-green-50", dot: "bg-green-400" },
];

function App() {
  const tasks = useTaskStore((state) => state.tasks);
  const moveTask = useTaskStore((state) => state.moveTask);
  const { draggedId, overColumn, onDragStart, onDragOver, onDrop, onDragEnd } = useDragAndDrop(moveTask);
  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const taskIds = tasks.map((t) => t.id);
  const activeUsers = useCollaboration(taskIds);
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Project Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your tasks across all stages</p>
        </div>

        {/* View Switcher */}
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
              title={u.name}
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
      <FilterBar tasks={tasks} onFilter={setFilteredTasks} />

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
                onDragOver={(e) => onDragOver(e, col.status)}
                onDrop={() => onDrop(col.status)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${col.dot}`}></div>
                  <h2 className="font-semibold text-gray-700 text-sm">{col.title}</h2>
                  <span className="ml-auto bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200">
                    {colTasks.length}
                  </span>
                </div>
                
                <div className="overflow-y-auto max-h-[500px] flex flex-col" onDragOver={(e) => e.preventDefault()}>
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
                      e.stopPropagation();
                      onDragStart(task.id);
                    }}
                    onDragEnd={onDragEnd}
                    style={{ cursor: "grab" }}
                    className={`transition-opacity ${
                      draggedId === task.id ? "opacity-40" : "opacity-100"
                    }`}
                  >
                      <TaskCard
                          task={task}
                          viewers={
                            activeUsers
                              .filter((u) => u.taskId === task.id)
                              .map((u) => ({ name: u.name as string, color: u.color as string }))
                          }
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
