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

// Seeded random — always produces same sequence
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function seededItem<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function seededDate(start: Date, end: Date, seed: number): string {
  const t = start.getTime() + seededRandom(seed) * (end.getTime() - start.getTime());
  return new Date(t).toISOString().split("T")[0];
}

function generateTasks(count: number): Task[] {
  const today = new Date();
  const past = new Date(today);
  past.setMonth(past.getMonth() - 2);
  const future = new Date(today);
  future.setMonth(future.getMonth() + 2);

  return Array.from({ length: count }, (_, i) => {
    const hasStartDate = seededRandom(i * 7) > 0.2;
    const startDate = hasStartDate ? seededDate(past, today, i * 3) : undefined;
    const isOverdue = seededRandom(i * 11) > 0.7;
    const dueDate = isOverdue
      ? seededDate(past, today, i * 5)
      : seededDate(today, future, i * 5);

    return {
      id: String(i + 1),
      title: `${seededItem(titles, i * 2)} ${i + 1}`,
      assignee: seededItem(assignees, i * 4),
      priority: seededItem(priorities, i * 6),
      status: seededItem(statuses, i * 8),
      startDate,
      dueDate,
    };
  });
}

export const tasks: Task[] = generateTasks(500);