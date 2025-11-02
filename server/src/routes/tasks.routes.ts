import express from 'express'
import prisma from '../../prisma/client'
import { AuthedRequest, requireAuth } from '../middleware/auth.middleware';
import { deleteTask, parseTask, updateTask } from '../controllers/tasks.controller';

const router = express.Router()

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
    try {
        const tasks = await prisma.task.findMany({ where: { userId: req.user?.id } });
        res.json(tasks);
    } catch (err) {
        console.log({err})
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { title, description, reminderAt, priority } = req.body?.data
        const task = await prisma.task.create({
            data: { userId, title, description, reminderAt: reminderAt ? new Date(reminderAt) : null, priority }
        })
        return res.status(201).json(task);
    } catch (error) {
        console.error("Error in create task : ", error)
        res.status(500).json({ error: 'Failed to create task' });
    }

})

router.put("/:id", requireAuth, updateTask)

router.delete("/:id", requireAuth, deleteTask)

router.post("/parseTask", requireAuth, parseTask)

export default router;