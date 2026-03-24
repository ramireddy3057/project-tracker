import type { Task } from "../types/task";

type Props = {
  task: Task;
};

function TaskCard({ task }: Props) {
  const today = new Date();
  const due = new Date(task.dueDate);
  const isOverdue = due < today && task.status !== "Done";
  const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  const isToday = due.toDateString() === today.toDateString();

  const priorityColors: Record<string, string> = {
    Critical: "bg-red-500",
    High: "bg-orange-500",
    Medium: "bg-blue-500",
    Low: "bg-green-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
      
      <h3 className="font-semibold text-gray-800 text-sm mb-3">{task.title}</h3>

      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
          {task.assignee}
        </div>

        <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p
        className={`text-xs font-semibold mt-1 ${
          isOverdue ? "text-red-500" : isToday ? "text-orange-500" : "text-gray-400"
        }`}
      >
        {isToday
          ? "⚠ Due Today"
          : isOverdue && diffDays > 7
          ? `🔴 ${diffDays} days overdue`
          : `📅 ${task.dueDate}`}
      </p>
    </div>
  );
}

export default TaskCard;