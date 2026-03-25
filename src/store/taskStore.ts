import { create } from "zustand";
import type { Task } from "../types/task";
import { tasks as initialTasks } from "../data/tasks";

interface TaskStore {
  tasks: Task[];
  moveTask: (taskId: string, newStatus: Task["status"]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: initialTasks,
  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    })),
}));