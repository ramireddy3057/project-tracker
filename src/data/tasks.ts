import type { Task, Priority, Status } from "../types/task";

const titles = [
  "Build login page", "Create dashboard UI", "Add API integration",
  "Fix responsive issues", "Write unit tests", "Update documentation",
  "Refactor auth module", "Design landing page", "Fix navbar layout",
  "Add dark mode", "Optimize images", "Setup CI/CD pipeline",
  "Fix memory leak", "Add search feature", "Create onboarding flow",
  "Update dependencies", "Fix cross-browser bugs", "Add error boundary",
  "Implement pagination", "Create admin panel",
];

const assignees = ["KR", "VK", "SR", "AR", "MJ", "PN"];
const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];
const statuses: Status[] = ["To Do", "In Progress", "In Review", "Done"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return d.toISOString().split("T")[0];
}

function generateTasks(count: number): Task[] {
  const today = new Date();
  const past = new Date(today);
  past.setMonth(past.getMonth() - 2);
  const future = new Date(today);
  future.setMonth(future.getMonth() + 2);

  return Array.from({ length: count }, (_, i) => {
    const hasStartDate = Math.random() > 0.2;
    const startDate = hasStartDate ? randomDate(past, today) : undefined;
    const dueDate = randomDate(
      startDate ? new Date(startDate) : today,
      future
    );

    // Make some tasks overdue
    const isOverdue = Math.random() > 0.7;
    const finalDueDate = isOverdue ? randomDate(past, today) : dueDate;

    return {
      id: String(i + 1),
      title: `${randomItem(titles)} ${i + 1}`,
      assignee: randomItem(assignees),
      priority: randomItem(priorities),
      status: randomItem(statuses),
      startDate,
      dueDate: finalDueDate,
    };
  });
}

export const tasks: Task[] = generateTasks(500);