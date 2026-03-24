import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
};

const priorityColors: Record<string, string> = {
  Critical: "bg-red-400",
  High: "bg-orange-400",
  Medium: "bg-blue-400",
  Low: "bg-green-400",
};

function TimelineView({ tasks }: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = today.toLocaleString("default", { month: "long", year: "numeric" });

  const DAY_WIDTH = 36;

  const getLeft = (dateStr: string) => {
    const d = new Date(dateStr);
    if (d.getMonth() !== month || d.getFullYear() !== year) return -1;
    return (d.getDate() - 1) * DAY_WIDTH;
  };

  const getWidth = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.max(
      1,
      Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    return diff * DAY_WIDTH;
  };

  const todayLeft = (today.getDate() - 1) * DAY_WIDTH + DAY_WIDTH / 2;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{monthName}</h2>

      {/* Day headers */}
      <div className="flex border-b border-gray-200 mb-2 relative">
        <div className="w-48 shrink-0" />
        <div className="flex">
          {days.map((d) => (
            <div
              key={d}
              style={{ width: DAY_WIDTH }}
              className={`text-center text-xs font-medium shrink-0 pb-2 ${
                d === today.getDate() ? "text-blue-600 font-bold" : "text-gray-400"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Task rows */}
      <div className="relative">
        {/* Today line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
          style={{ left: `${192 + todayLeft}px` }}
        />

        {tasks.map((task) => {
          const startDate = task.startDate ?? task.dueDate;
          const left = getLeft(startDate);
          const width = getWidth(startDate, task.dueDate);
          const isSingleDay = !task.startDate;

          if (left < 0) return null;

          return (
            <div key={task.id} className="flex items-center mb-3 h-8">
              {/* Task name */}
              <div className="w-48 shrink-0 text-sm text-gray-700 font-medium truncate pr-3">
                {task.title}
              </div>

              {/* Bar area */}
              <div className="relative flex-1 h-6">
                <div
                  className={`absolute h-6 rounded-full flex items-center px-2 text-white text-xs font-semibold truncate ${
                    priorityColors[task.priority]
                  } ${isSingleDay ? "w-4 rounded-full" : ""}`}
                  style={{
                    left: left,
                    width: isSingleDay ? DAY_WIDTH : width,
                  }}
                  title={task.title}
                >
                  {!isSingleDay && task.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelineView;