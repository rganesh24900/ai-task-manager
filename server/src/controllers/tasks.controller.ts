import { RequestHandler } from "express";
import prisma from "../../prisma/client";
import type { Request, Response } from "express";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const updateTask: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority } = req.body?.data;

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, dueDate, priority },
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
Extract the following fields and return **pure JSON only** — do NOT include markdown or explanations.

Fields:
{
  "title": string,
  "dueDate": ISO date (YYYY-MM-DDTHH:mm:ssZ) representing the *next occurrence* if a relative time (like "tomorrow" or "at 6pm weekly") is mentioned,
  "time": 24-hour HH:mm or null,
  "priority": "Low" | "Medium" | "High" | null,
  "assignees": string[] or [],
  "recurrence": "Daily" | "Weekly" | "Monthly" | null
}

If no specific date is mentioned but a recurrence or time is present, infer the *next logical date* starting from the current day.
For example:
- "tomorrow at 10am" → dueDate = tomorrow's date with 10:00 time
- "at 6pm weekly" → dueDate = today's date at 18:00 if time not passed, else tomorrow or next week
- "next Monday" → dueDate = actual next Monday
User input: "${text}"
`;


        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [
                { role: "system", content: "You are an intelligent date-aware task parser." },
                { role: "user", content: prompt },
            ],
        });

        const message = response.choices[0].message.content?.trim();
        console.log({ message })
        const parsed = JSON.parse(message || "{}");

        return res.status(200).json(parsed);
    } catch (err) {
        console.error("Parse Error:", err);
        return res.status(500).json({ error: "Failed to parse task" });
    }
};


