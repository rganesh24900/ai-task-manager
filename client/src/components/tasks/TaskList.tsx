import React, { useState, useMemo, useEffect } from "react";
import Button from "../../common/components/Button";
import { useTaskPopup } from "../../hooks/tasks/useTaskPopup";
import useTasks from "../../hooks/tasks/useTasks";
import useLogout from "../../hooks/auth/useLogout";
import type { Task } from "../../types";
import { Trash, LogOut, Calendar, Bell } from "lucide-react";
import TaskFilter from "./TaskFilter";

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const { confirm, ConfirmDialog } = useTaskPopup();
  const { mutate: handleLogout } = useLogout();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [reminders, setReminders] = useState<Task[]>([]);

  // ---------- FILTER & SORT ----------
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    let result = [...tasks];

    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "completed") result = result.filter((t) => t.completed);
    else if (filter === "pending") result = result.filter((t) => !t.completed);
    else if (["High", "Medium", "Low"].includes(filter))
      result = result.filter((t) => t.priority === filter);

    if (sort === "dueDateAsc")
      result.sort(
        (a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime()
      );
    else if (sort === "dueDateDesc")
      result.sort(
        (a, b) => new Date(b.dueDate || "").getTime() - new Date(a.dueDate || "").getTime()
      );
    else if (sort === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    return result;
  }, [tasks, filter, search, sort]);

  // Permissions
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ---------- REMINDERS ----------
  useEffect(() => {
    if (!tasks?.length) return;

    const checkReminders = () => {
      const now = new Date();
      const upcoming = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const diff = new Date(task.dueDate).getTime() - now.getTime();
        return diff > 0 && diff <= 30 * 60 * 1000;
      });

      setReminders(upcoming);

      if ("Notification" in window && Notification.permission === "granted") {
        upcoming.forEach((task) => {
          new Notification("Upcoming Task", {
            body: `${task.title} is due at ${new Date(task.dueDate||"").toLocaleTimeString()}`
          });
        });
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="min-h-screen p-6 bg-[#fafafa]">
      {/* PAGE HEADER */}
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Tasks
        </h1>

        <div className="flex gap-3">
          {/* CREATE TASK */}
          <Button
            variant="primary"
            onClick={() => confirm("CREATE")}
            className="px-5 py-2"
          >
            + Create Task
          </Button>
        </div>
      </div>


      {/* FILTER SECTION */}
      <TaskFilter
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      {/* REMINDER BAR */}
      {reminders.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 text-yellow-800">
          <Bell className="w-5 h-5" />
          <span className="font-medium">
            {reminders.length} tasks due soon:
          </span>
          {reminders.map((task) => (
            <span
              key={task.id}
              className="bg-yellow-100 px-2 py-1 rounded-md text-xs font-medium"
            >
              {task.title}
            </span>
          ))}
        </div>
      )}

      {/* LOADING / EMPTY */}
      {isLoading && <p className="text-center text-gray-500 mt-10">Loading...</p>}
      {isError && (
        <p className="text-center text-red-500 mt-10">
          Error: {(error as Error).message}
        </p>
      )}
      {!isLoading && !isError && !tasks?.length && (
        <p className="text-center text-gray-400 mt-10">No tasks found</p>
      )}

      {/* TASK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-[#fafafa] border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {task.description || "—"}
                </p>
              </div>

              <div className="flex gap-2">
                {/* EDIT */}
                <Button
                  variant="tertiary"
                  onClick={() => confirm("UPDATE", task)}
                  className="px-3 py-1 text-xs"
                >
                  Edit
                </Button>

                {/* DELETE */}
                <Button
                  variant="danger"
                  onClick={() => confirm("DELETE", task)}
                  className="px-3 py-1 text-xs flex items-center gap-1"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </Button>
              </div>

            </div>

            {/* PRIORITY + DATE */}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span
                className={`px-2 py-1 rounded-md font-medium
              ${task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {task.priority}
              </span>

              {task.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleString()}
                </span>
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
