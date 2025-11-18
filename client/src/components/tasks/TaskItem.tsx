import Button from '../../common/components/Button'
import useTaskAction from '../../hooks/tasks/useTaskAction';
import type { ActionType, Task } from '../../types'
import { Calendar, CheckCircle, Trash } from 'lucide-react'

const TaskItem = ({ task, confirm }: { task: Task, confirm: (actionType: ActionType, payload: any) => void }) => {
    const { mutate: actionTaskMutate } = useTaskAction();

    return (
        <div
            key={task.id}
            className={`bg-[#fafafa] rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 relative ${task.completed ? "opacity-60" : ""
                }`}
        >
            <button
                onClick={() => {
                    const updatedTask: Task = { ...task, completed: !task.completed }
                    actionTaskMutate({ payload: updatedTask, action: "UPDATE" })
                }}
                className={`absolute top-4 right-4 rounded-full p-1 transition-all ${task.completed
                    ? "text-green-600 bg-green-100"
                    : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                    }`}
            >
                <CheckCircle className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3
                        className={`text-lg font-semibold ${task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                            }`}
                    >
                        {task.title}
                    </h3>
                    <p
                        className={`text-gray-600 text-sm mt-1 ${task.completed ? "line-through text-gray-400" : ""
                            }`}
                    >
                        {task.description || "—"}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span
                    className={`px-2 py-1 rounded-md font-semibold ${task.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                >
                    {task.priority}
                </span>
                {task.dueDate && (
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {new Date(task.dueDate).toLocaleString()}
                    </span>
                )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button
                    onClick={() => confirm("UPDATE", task)}
                    variant="secondary"
                    className="px-3 py-1 text-sm rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                    Edit
                </Button>
                <Button
                    onClick={() => confirm("DELETE", task)}
                    variant="danger"
                    className="px-3 py-1 flex items-center gap-1 text-sm bg-red-50 text-red-600 hover:bg-red-100"
                >
                    <Trash className="w-4 h-4" />
                    Delete
                </Button>
            </div>
        </div>
    )
}

export default TaskItem