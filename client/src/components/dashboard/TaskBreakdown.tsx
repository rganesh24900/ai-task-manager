import { Cell, Legend, Pie, Tooltip } from "recharts";
import { PieChart } from "recharts";

const TaskBreakdown = ({ stats }: {
    stats: {
        TODO: number;
        IN_PROGRESS: number;
        DONE: number;
    }
}) => {

    const chartData = [
        { name: "Todo", value: stats.TODO, color: "#fbbf24" },
        { name: "In Progress", value: stats.IN_PROGRESS, color: "#3b82f6" },
        { name: "Done", value: stats.DONE, color: "#10b981" },
    ];


    const total = stats.TODO + stats.IN_PROGRESS + stats.DONE;

    const safeData = total === 0
        ? [{ name: "No Tasks", value: 1, color: "e5e7eb" }]
        : chartData;

    return (
        <PieChart width={350} height={280}>
            <Pie
                data={safeData}
                dataKey="value"
            >
                {safeData.map((_, i) => (
                    <Cell key={i} fill={_.color} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default TaskBreakdown;
