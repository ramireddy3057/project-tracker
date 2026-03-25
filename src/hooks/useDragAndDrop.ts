import { useState } from "react";
import type { Task } from "../types/task";

export function useDragAndDrop(moveTask: (id: string, status: Task["status"]) => void) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  const onDragStart = (taskId: string) => {
    setDraggedId(taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDragEnter = (status: string) => {
    setOverColumn(status);
  };

  const onDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    if (draggedId) {
      moveTask(draggedId, status);
    }
    setDraggedId(null);
    setOverColumn(null);
  };

  const onDragEnd = () => {
    setDraggedId(null);
    setOverColumn(null);
  };

  return { draggedId, overColumn, onDragStart, onDragOver, onDragEnter, onDrop, onDragEnd };
}