import type { Task } from '../../types'

const TaskOverview = ({
    tasks,
    stats,
}: {
    tasks: Task[],
    stats: {
        TODO: number;
        IN_PROGRESS: number;
        DONE: number;
    }
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-700">Total Tasks</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tasks?.length || 0}</p>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-700">Pending</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.TODO}</p>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.IN_PROGRESS}</p>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-700">Completed</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.DONE}</p>
            </div>
        </div>
    );
}

export default TaskOverview;
