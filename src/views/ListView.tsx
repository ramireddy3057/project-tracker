import type { Task } from "../types/task";
import { useState } from "react";

type Props = {
  tasks: Task[];
};

type SortKey = "title" | "priority" | "dueDate";
type SortDir = "asc" | "desc";

const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function ListView({ tasks }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...tasks].sort((a, b) => {
    if (sortKey === "title") {
      return sortDir === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortKey === "priority") {
      return sortDir === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortKey === "dueDate") {
      return sortDir === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    return 0;
  });

  const arrow = (key: SortKey) => {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const priorityColors: Record<string, string> = {
    Critical: "bg-red-100 text-red-600",
    High: "bg-orange-100 text-orange-600",
    Medium: "bg-blue-100 text-blue-600",
    Low: "bg-green-100 text-green-600",
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-500 font-medium">No tasks found</p>
        <p className="text-gray-400 text-sm mt-1">Try clearing your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              className="text-left px-4 py-3 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort("title")}
            >
              Title{arrow("title")}
            </th>
            <th
              className="text-left px-4 py-3 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort("priority")}
            >
              Priority{arrow("priority")}
            </th>
            <th className="text-left px-4 py-3 text-gray-600 font-semibold">
              Status
            </th>
            <th className="text-left px-4 py-3 text-gray-600 font-semibold">
              Assignee
            </th>
            <th
              className="text-left px-4 py-3 text-gray-600 font-semibold cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort("dueDate")}
            >
              Due Date{arrow("dueDate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task, i) => {
            const today = new Date();
            const due = new Date(task.dueDate);
            const isOverdue = due < today && task.status !== "Done";
            const isToday = due.toDateString() === today.toDateString();

            return (
              <tr
                key={task.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {task.title}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{task.status}</td>
                <td className="px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    {task.assignee}
                  </div>
                </td>
                <td className={`px-4 py-3 text-xs font-medium ${isOverdue ? "text-red-500" : isToday ? "text-orange-500" : "text-gray-500"}`}>
                  {isToday ? "⚠ Due Today" : isOverdue ? `🔴 Overdue` : task.dueDate}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListView;