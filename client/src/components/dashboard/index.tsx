import useTasks from "../../hooks/tasks/useTasks";
import TaskOverview from "./TaskOverview";
import TaskBreakdown from "./TaskBreakdown";
import TaskNavigation from "./TaskNavigation";
import { useMemo } from "react";

export default function Dashboard() {
    const { data: tasks } = useTasks();

    const stats = useMemo(() => {
        if (!tasks) return { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        return tasks.reduce(
            (acc, t) => {
                acc[t.status]++;
                return acc;
            },
            { TODO: 0, IN_PROGRESS: 0, DONE: 0 }
        );
    }, [tasks]);



    return (
        <div className="min-h-screen p-6 bg-[#fafafa]">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Dashboard</h1>

            <TaskOverview tasks={tasks ?? []} stats={stats} />

            {/* Chart */}
            <TaskBreakdown stats={stats} />

            {/* Navigation */}
            <TaskNavigation />
        </div>
    );
}
