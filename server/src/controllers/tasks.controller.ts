import { RequestHandler } from "express";
import prisma from "../../prisma/client";

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
