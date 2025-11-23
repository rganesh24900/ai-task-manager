import { Bell } from "lucide-react";
import { useReminders } from "./ReminderContext";

export default function ReminderBar() {
    const { notified } = useReminders();

    if (notified.length === 0) return null;

    return (
        <div className="bg-yellow-50 border border-yellow-200 p-3 flex gap-3 items-center">
            <Bell className="w-4 h-4 text-yellow-700" />
            <strong>{notified.length} tasks due soon: </strong>

            {notified.map((task) => (
                <span key={task.id} className="text-yellow-900 font-medium">
                    {task.title}
                </span>
            ))}
        </div>
    );
}
