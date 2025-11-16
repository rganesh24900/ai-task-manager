import express from 'express'
import cors from 'cors'
import dotEnv from 'dotenv'
import taskRoutes from './routes/tasks.routes'
import authRoutes from './routes/auth.routes'
import cookieParser from 'cookie-parser'

dotEnv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://ai-task-manager-production-97c9.vercel.app",
        ],
        credentials: true,
    })
);


app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server running smoothly 🚀" });
});

export default app;
