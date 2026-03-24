export type Priority = "Low" | "Medium" | "High" | "Critical";

export type Status = "To Do" | "In Progress" | "In Review" | "Done";

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  status: Status;
  startDate?: string;
  dueDate: string;
}