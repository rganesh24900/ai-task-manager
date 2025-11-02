import { RequestHandler } from "express";
import prisma from "../../prisma/client";
import type { Request, Response } from "express";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const updateTask: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, reminderAt, priority, subtasks } = req.body?.data;

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, reminderAt, priority, subtasks },
        });
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update task" });
    }
};

export const deleteTask: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id; // from your requireAuth middleware

        if (!id) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        // Check if the task exists and belongs to the current user
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        await prisma.task.delete({
            where: { id },
        });

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Delete task error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




export const parseTask = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        const prompt = `
Extract the following fields from the input and return JSON only.

Fields:
{
  "title": string,
  "dueDate": ISO date (YYYY-MM-DD) or null,
  "time": 24-hour HH:mm or null,
  "priority": "Low" | "Medium" | "High" | null,
  "assignees": string[] or [],
  "recurrence": "Daily" | "Weekly" | "Monthly" | null
}

User input: "${text}"
`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [
                { role: "system", content: "You are a task parser." },
                { role: "user", content: prompt },
            ],
        });

        const message = response.choices[0].message.content;
        const parsed = JSON.parse(message || "{}");

        return res.status(200).json(parsed);
    } catch (err) {
        console.error("Parse Error:", err);
        return res.status(500).json({ error: "Failed to parse task" });
    }
};

