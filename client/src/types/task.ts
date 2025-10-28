// src/types/task.ts


export type TaskStatus = 'completed' | 'pending';

// src/types/task.ts

export type Priority = "Low" | "Medium" | "High"

export interface Subtask {
    id?: number;
    title: string;
    completed: boolean;
}

export interface Task {
    id?: number;
    title: string;
    description?: string;
    reminderAt?: string | Date;
    priority: Priority;
    subtasks?: Subtask[];
    completed?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type ActionType = "CREATE" | "UPDATE" | "DELETE"

