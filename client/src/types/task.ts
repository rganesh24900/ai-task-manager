// src/types/task.ts


export type TaskStatus = 'completed' | 'pending';

// src/types/task.ts

export type Priority = "Low" | "Medium" | "High"

// src/types.ts
export interface Task {
  id?: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "pending" | "in_progress" | "completed";
  dueDate?: string; // ISO date (converted from DateTime)
  time?: string; // "HH:mm" format
  recurrence?: "none" | "daily" | "weekly" | "monthly";
  assignees?: string[]; // array of user IDs or names
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean
}

export type ActionType = "CREATE" | "UPDATE" | "DELETE"

