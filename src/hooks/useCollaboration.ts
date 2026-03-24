import { useState, useEffect } from "react";

export type SimUser = {
  id: string;
  name: string;
  color: string;
  taskId: string;
};

const USERS = [
  { id: "u1", name: "KR", color: "bg-purple-500" },
  { id: "u2", name: "VK", color: "bg-pink-500" },
  { id: "u3", name: "SR", color: "bg-yellow-500" },
  { id: "u4", name: "MJ", color: "bg-green-500" },
];

export function useCollaboration(taskIds: string[]) {
  const [activeUsers, setActiveUsers] = useState<SimUser[]>([]);

  useEffect(() => {
    if (taskIds.length === 0) return;

    const assign = () => {
      const shuffled = [...taskIds].sort(() => Math.random() - 0.5);
      setActiveUsers(
        USERS.map((u, i) => ({
          ...u,
          taskId: shuffled[i % shuffled.length],
        }))
      );
    };

    assign();
    const interval = setInterval(assign, 3000);
    return () => clearInterval(interval);
  }, [taskIds.length]);

  return activeUsers;
}