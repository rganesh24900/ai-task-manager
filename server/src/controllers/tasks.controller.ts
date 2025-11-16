import { RequestHandler } from "express";
import prisma from "../prisma/client";
import type { Request, Response } from "express";
import OpenAI from "openai";
import chrono from "chrono-node";


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const updateTask: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, completed } = req.body?.data;

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, dueDate, priority, completed },
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
        const today = new Date().toISOString();

        const prompt = `
You are a smart AI task parser and planner.

Today’s date is: ${today}

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
- Parse temporal hints like “tomorrow”, “next Monday”, “at 6pm weekly”, etc.
- When interpreting dates like "tomorrow", use today’s date: ${today}.
- Ensure dueDate is ALWAYS after today.
- Always produce valid ISO date strings.
- If no dueDate but time exists, set to today at the given time.
- Only return JSON.

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
        message = message.replace(/```json|```/g, "").trim();

        const parsed = JSON.parse(message);

        if (parsed.dueDate && isNaN(Date.parse(parsed.dueDate))) {
            const chronoDate = chrono.parseDate(parsed.dueDate, new Date());
            parsed.dueDate = chronoDate ? chronoDate.toISOString() : null;
        }

        if (!parsed.dueDate && parsed.time) {
            const now = new Date();
            const [hours, minutes] = parsed.time.split(":").map(Number);
            now.setHours(hours, minutes, 0, 0);
            parsed.dueDate = now.toISOString();
        }

        return res.status(200).json(parsed);
    } catch (err) {
        console.error("Parse Error:", err);
        return res.status(500).json({ error: "Failed to parse or generate task suggestions" });
    }
};



