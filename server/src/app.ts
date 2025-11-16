import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
import taskRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";

dotEnv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://ai-task-manager-two.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log("BLOCKED CORS:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.options("*", cors());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server running smoothly 🚀" });
});

export default app;
