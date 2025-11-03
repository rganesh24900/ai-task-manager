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
You are a smart task parser. Your job is to extract structured data from the input text.

**Today's date:** ${new Date().toISOString().split("T")[0]}

Interpret natural language expressions like "tomorrow", "next Monday", "in 2 days", or "at 10am"
into proper ISO 8601 date-time format.

Return ONLY JSON in the following structure:
{
  "title": string,
  "priority": "Low" | "Medium" | "High" | null,
  "dueDate": string | null, // ISO format "YYYY-MM-DDTHH:mm:ssZ"
  "time": string | null,    // 24-hour "HH:mm"
  "recurrence": "none" | "daily" | "weekly" | "monthly" | null,
  "assignees": string[] | []
}

Example:
Input: "Team sync meeting with Alex next Tuesday at 3pm"
Output:
{
  "title": "Team sync meeting with Alex",
  "priority": null,
  "dueDate": "2025-11-11T15:00:00Z",
  "time": "15:00",
  "recurrence": null,
  "assignees": ["Alex"]
}

Now extract structured details for:
"${text}"
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
        const parsed = JSON.parse(message || "{}");

        return res.status(200).json(parsed);
    } catch (err) {
        console.error("Parse Error:", err);
        return res.status(500).json({ error: "Failed to parse task" });
    }
};


