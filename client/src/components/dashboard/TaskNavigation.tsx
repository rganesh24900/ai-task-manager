import { Link } from "react-router-dom";
import { ListTodo, Kanban } from "lucide-react";

const TaskNavigation = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">

            <Link
                to="/list"
                className="group p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gray-900 text-white group-hover:scale-110 transition">
                        <ListTodo className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Task List</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            View, manage, and organize your tasks with ease.
                            Your productivity command center.
                        </p>
                    </div>
                </div>
            </Link>

            <Link
                to="/board"
                className="group p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gray-900 text-white group-hover:scale-110 transition">
                        <Kanban className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Task Board</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Visualize your workflow with an intuitive Kanban board.
                            Drag, drop, and conquer your tasks.
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default TaskNavigation;
