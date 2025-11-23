import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import useTasks from "../../hooks/tasks/useTasks";
import type { ReminderContextType, Task } from "../../types";

const ReminderContext = createContext<ReminderContextType>({
    notified: []
});

export function ReminderProvider({ children }: { children: ReactNode }) {
    const { data: tasks } = useTasks();
    const [notified, setNotified] = useState<Task[]>([]);

    useEffect(() => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (!tasks || !tasks?.length) return;

        const checkReminders = () => {
            const now = new Date();

            tasks.forEach((task) => {
                if (!task.dueDate || !task.id) return;

                const diff = new Date(task.dueDate).getTime() - now.getTime();

                if (diff > 0 && diff <= 15 * 60 * 1000) {
                    const alreadyNotified = notified.some((t) => t.id === task.id);

                    if (!alreadyNotified) {
                        sendNotification(task);
                        setNotified((prev) => [...prev, task]);
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 60 * 1000);
        return () => clearInterval(interval);
    }, [tasks, notified]);

    const sendNotification = (task: Task) => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted" && task.dueDate) {
            new Notification("Task Reminder", {
                body: `${task.title} is due at ${new Date(task.dueDate).toLocaleTimeString()}`
            });
        }
    };

    return (
        <ReminderContext.Provider value={{ notified }}>
            {children}
        </ReminderContext.Provider>
    );
}

export const useReminders = () => useContext(ReminderContext);
