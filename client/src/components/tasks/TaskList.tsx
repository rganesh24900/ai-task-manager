import React from "react";
import Button from "../../common/components/Button";
import { useTaskPopup } from "../../hooks/tasks/useTaskPopup";
import useTasks from "../../hooks/tasks/useTasks";
import type { Task } from "../../types";

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const { confirm, ConfirmDialog } = useTaskPopup();

  if (isLoading) return <p className="text-gray-500 text-center">Loading tasks...</p>;
  if (isError) return <p className="text-red-500 text-center">Error: {(error as Error).message}</p>;
  if (!tasks?.length) return <p className="text-gray-400 text-center">No tasks found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
        <Button
          onClick={() => confirm("CREATE")}
          className="px-4 py-2 rounded-lg  text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          + Create Task
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
              <Button onClick={() => confirm("UPDATE", task)} variant="primary" className="px-3 py-1">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>
              {task.reminderAt && (
                <span className="flex items-center gap-1">
                  ⏰ {new Date(task.reminderAt).toLocaleString()}
                </span>
              )}
            </div>

            {task.subtasks && task.subtasks?.length > 0 && (
              <ul className="mt-3 ml-4 list-disc text-gray-500 space-y-1">
                {task.subtasks.map((st, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input type="checkbox" checked={st.completed} readOnly />
                    <span className={st.completed ? "line-through text-gray-400" : ""}>{st.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default TaskList;
