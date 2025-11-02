import React from "react";
import Button from "../../common/components/Button";
import { useTaskPopup } from "../../hooks/tasks/useTaskPopup";
import useTasks from "../../hooks/tasks/useTasks";
import useLogout from "../../hooks/auth/useLogout";
import type { Task } from "../../types";
import { Trash, LogOut } from "lucide-react";

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const { confirm, ConfirmDialog } = useTaskPopup();
  const { mutate: handleLogout } = useLogout();

  return (
    <div >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => confirm("CREATE")}
            className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
          >
            + Create Task
          </Button>

          <Button
            onClick={() => handleLogout()}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium shadow-md transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Task grid */}
      {isLoading && <p className="text-gray-500 text-center">Loading tasks...</p>}
      {isError && <p className="text-red-500 text-center">Error: {(error as Error).message}</p>}
      {!isLoading && !isError && !tasks?.length && (
        <p className="text-gray-400 text-center">No tasks found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks?.map((task: Task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => confirm("UPDATE", task)}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => confirm("DELETE", task)}
                    variant="danger"
                    className="px-3 py-1 flex items-center gap-1 text-sm"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span
                  className={`px-2 py-1 rounded-md font-semibold ${task.priority === "High"
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

              {task.subtasks && task.subtasks.length > 0 && (
                <ul className="mt-3 ml-3 list-disc text-gray-500 space-y-1 text-sm">
                  {task.subtasks.map((st, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        readOnly
                        className="accent-purple-600"
                      />
                      <span
                        className={
                          st.completed ? "line-through text-gray-400" : ""
                        }
                      >
                        {st.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog />
    </div>
  );
};

export default TaskList;
