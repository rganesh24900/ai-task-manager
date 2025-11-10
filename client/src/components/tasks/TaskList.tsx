import React, { useState, useMemo } from "react";
import Button from "../../common/components/Button";
import { useTaskPopup } from "../../hooks/tasks/useTaskPopup";
import useTasks from "../../hooks/tasks/useTasks";
import useLogout from "../../hooks/auth/useLogout";
import type { Task } from "../../types";
import { LogOut } from "lucide-react";
import TaskFilter from "./TaskFilter";
import TaskItem from "./TaskItem";

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const { confirm, ConfirmDialog } = useTaskPopup();
  const { mutate: handleLogout } = useLogout();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");


  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    let result = [...tasks];

    // Search
    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter
    if (filter === "completed") result = result.filter((t) => t.completed);
    else if (filter === "pending") result = result.filter((t) => !t.completed);
    else if (["High", "Medium", "Low"].includes(filter)) {
      result = result.filter((t) => t.priority === filter);
    }

    // Sort
    if (sort === "dueDateAsc")
      result.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    else if (sort === "dueDateDesc")
      result.sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      );
    else if (sort === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    return result;
  }, [tasks, filter, search, sort]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Task Manager
        </h1>

        <div className="flex gap-3">
          <Button
            onClick={() => confirm("CREATE")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            + Create Task
          </Button>

          <Button
            onClick={() => handleLogout()}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <TaskFilter
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      {/* Task grid */}
      {isLoading && (
        <p className="text-gray-500 text-center mt-10">Loading tasks...</p>
      )}
      {isError && (
        <p className="text-red-500 text-center mt-10">
          Error: {(error as Error).message}
        </p>
      )}
      {!isLoading && !isError && !tasks?.length && (
        <p className="text-gray-400 text-center mt-10">No tasks found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task: Task) => (
          <TaskItem task={task} confirm={confirm}/>
        ))}
      </div>

      <ConfirmDialog />
    </div>
  );
};

export default TaskList;
