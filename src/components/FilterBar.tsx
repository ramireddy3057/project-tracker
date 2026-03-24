import { useState } from "react";
import type { Task, Priority, Status } from "../types/task";


type Props = {
  tasks: Task[];
  onFilter: (filtered: Task[]) => void;
};

const ALL_STATUSES: Status[] = ["To Do", "In Progress", "In Review", "Done"];
const ALL_PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];

function FilterBar({ tasks, onFilter }: Props) {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const allAssignees = [...new Set(tasks.map((t) => t.assignee))];

  const isActive =
    statuses.length > 0 ||
    priorities.length > 0 ||
    assignees.length > 0 ||
    from !== "" ||
    to !== "";

  const applyFilters = (
    s: Status[],
    p: Priority[],
    a: string[],
    f: string,
    t: string
  ) => {
    let result = [...tasks];
    if (s.length > 0) result = result.filter((task) => s.includes(task.status));
    if (p.length > 0) result = result.filter((task) => p.includes(task.priority));
    if (a.length > 0) result = result.filter((task) => a.includes(task.assignee));
    if (f) result = result.filter((task) => new Date(task.dueDate) >= new Date(f));
    if (t) result = result.filter((task) => new Date(task.dueDate) <= new Date(t));
    onFilter(result);
  };

  const toggleStatus = (s: Status) => {
    const updated = statuses.includes(s)
      ? statuses.filter((x) => x !== s)
      : [...statuses, s];
    setStatuses(updated);
    applyFilters(updated, priorities, assignees, from, to);
  };

  const togglePriority = (p: Priority) => {
    const updated = priorities.includes(p)
      ? priorities.filter((x) => x !== p)
      : [...priorities, p];
    setPriorities(updated);
    applyFilters(statuses, updated, assignees, from, to);
  };

  const toggleAssignee = (a: string) => {
    const updated = assignees.includes(a)
      ? assignees.filter((x) => x !== a)
      : [...assignees, a];
    setAssignees(updated);
    applyFilters(statuses, priorities, updated, from, to);
  };

  const clearAll = () => {
    setStatuses([]);
    setPriorities([]);
    setAssignees([]);
    setFrom("");
    setTo("");
    onFilter(tasks);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-4 items-end">

      {/* Status */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">Status</p>
        <div className="flex gap-1 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                statuses.includes(s)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">Priority</p>
        <div className="flex gap-1 flex-wrap">
          {ALL_PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => togglePriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                priorities.includes(p)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">Assignee</p>
        <div className="flex gap-1 flex-wrap">
          {allAssignees.map((a) => (
            <button
              key={a}
              onClick={() => toggleAssignee(a)}
              className={`w-8 h-8 rounded-full text-xs font-bold border transition-all ${
                assignees.includes(a)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">Due Date Range</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              applyFilters(statuses, priorities, assignees, e.target.value, to);
            }}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              applyFilters(statuses, priorities, assignees, from, e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600"
          />
        </div>
      </div>

      {/* Clear All */}
      {isActive && (
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all"
        >
          ✕ Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;