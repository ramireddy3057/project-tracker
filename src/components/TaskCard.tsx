import type { Task } from "../types/task";

type Props = {
  task: Task;
  viewers: {
    name: string;
    color: string;
  }[];
};

function TaskCard({ task, viewers }: Props){
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
      {viewers.length > 0 && (
      <div className="flex -space-x-1 mt-2">
        {viewers.slice(0, 2).map((v, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full ${v.color} text-white text-xs flex items-center justify-center border border-white`}
          >
            {v.name[0]}
          </div>
        ))}
        {viewers.length > 2 && (
          <div className="w-5 h-5 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center border border-white">
            +{viewers.length - 2}
          </div>
        )}
  </div>
)}
    </div>
  );
}

export default TaskCard;