// src/types/task.ts


export type TaskStatus = 'completed' | 'pending';

// src/types/task.ts

export type Priority = "Low" | "Medium" | "High"

export interface Subtask {
    id?: number;
    title: string;
    completed: boolean;
}
// src/types.ts
export interface Task {
  id?: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  dueDate?: string; // ISO date (converted from DateTime)
  time?: string; // "HH:mm" format
  recurrence?: "none" | "daily" | "weekly" | "monthly";
  assignees?: string[]; // array of user IDs or names
  createdAt?: string;
  updatedAt?: string;
}

export type ActionType = "CREATE" | "UPDATE" | "DELETE"

