import React from "react";
import Button from "../../common/components/Button";
import { useTaskPopup } from "../../hooks/tasks/useTaskPopup";
import useTasks from "../../hooks/tasks/useTasks";
import type { Task } from "../../types";
import { cn } from "../../common/utils";

const TaskList: React.FC = () => {
    const { data: tasks, isLoading, isError, error } = useTasks();
    const { confirm, ConfirmDialog } = useTaskPopup();

    if (isLoading) return <p className="text-gray-500">Loading tasks...</p>;
    if (isError) return <p className="text-red-500">Error: {(error as Error).message}</p>;

    return (
        <div className="flex flex-col gap-3 p-4">
            {/* Header with Create button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
                <Button
                    onClick={() => confirm("CREATE", null)}
                    variant="primary"
                >
                    + Create Task
                </Button>
            </div>

            {/* Tasks List */}
            {(!tasks || tasks.length === 0) ? (
                <p className="text-gray-400">No tasks found</p>
            ) : (
                tasks.map((task: Task) => (
                    <div
                        key={task.id}
                        className="border rounded-lg p-3 shadow-sm hover:shadow-md transition bg-white"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                            <Button
                                variant="secondary"
                                className="w-[104px]"
                                onClick={() => confirm("UPDATE", task)}
                            >
                                Edit
                            </Button>
                        </div>

                        <p className="text-gray-600 mt-1">{task.description}</p>

                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                            <span>Priority: {task.priority}</span>
                            {task.reminderAt && (
                                <span>⏰ {new Date(task.reminderAt).toLocaleString()}</span>
                            )}
                        </div>

                        {task.subtasks?.length && (
                            <ul className="mt-2 ml-4 list-disc text-gray-500">
                                {task.subtasks.map((st) => (
                                    <li key={st.id}>
                                        <div>{st.title} <span className={cn("text-xs text-yellow-100", { "text-green-600": st.completed })}>{st.completed ? "Completed" : "Pending"}</span></div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))
            )}

            <ConfirmDialog />
        </div>
    );
};

export default TaskList;
