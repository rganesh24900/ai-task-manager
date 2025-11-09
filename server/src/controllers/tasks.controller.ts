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
You are a smart AI task parser and planner.

Given a user input describing a task, extract the structured task details and
suggest meaningful subtasks and next actions.

Return ONLY valid JSON in the following format:

{
  "title": string,
  "description": string | null,
  "dueDate": ISO date string (YYYY-MM-DDTHH:mm:ssZ) or null,
  "time": "HH:mm" | null,
  "priority": "Low" | "Medium" | "High" | null,
  "assignees": string[] or [],
  "recurrence": "Daily" | "Weekly" | "Monthly" | null,
  "suggestedSubtasks": [
    { "title": string, "dueInDays": number | null }
  ],
  "suggestedNextActions": string[]
}

Rules:
- If user says “tomorrow”, “at 6pm weekly”, or similar → infer the next logical due date.
- If no due date but time exists → assume today's or next occurrence.
- Always include realistic subtasks and next actions.
- Use only valid JSON — no markdown formatting, no \`\`\`json fences.

User input: "${text}"
`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                { role: "system", content: "You are a date-aware AI task planner." },
                { role: "user", content: prompt },
            ],
        });

        let message = response.choices[0].message.content?.trim() || "{}";
        message = message.replace(/```json|```/g, "").trim(); // clean if model adds fences
        const parsed = JSON.parse(message);

        return res.status(200).json(parsed);
    } catch (err) {
        console.error("Parse Error:", err);
        return res.status(500).json({ error: "Failed to parse or generate task suggestions" });
    }
};


