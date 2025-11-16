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

  // 🔍 Filter & Sort logic
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

  // 🔔 Ask for Notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!tasks?.length) return;

    const checkReminders = () => {
      const now = new Date();
      const upcoming = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        const diff = due.getTime() - now.getTime();
        return diff > 0 && diff <= 30 * 60 * 1000; // within 30 minutes
      });

      setReminders(upcoming);

      // Show notifications
      if ("Notification" in window && Notification.permission === "granted") {
        upcoming.forEach((task) => {
          new Notification("Upcoming Task Reminder", {
            body: `${task.title} is due at ${new Date(
              task.dueDate || ""
            ).toLocaleTimeString()}`,
            icon: "/bell-icon.png", // optional icon
          });
        });
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

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

      {/* Filter & Search */}
      <TaskFilter
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      {/* 🔔 Reminder Bar */}
      {reminders.length > 0 && tasks?.length && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 text-yellow-800">
          <Bell className="w-5 h-5" />
          <span className="font-medium">
            {reminders.length} task(s) due soon:
          </span>
          {reminders.map((task) => (
            <span
              key={task.id}
              className="bg-yellow-100 px-2 py-1 rounded-md text-sm font-semibold"
            >
              {task.title} ({new Date(task.dueDate || "").toLocaleTimeString()})
            </span>
          ))}
        </div>
      )}

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
          <div
            key={task.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {task.description || "—"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => confirm("UPDATE", task)}
                  className="px-3 py-1 text-sm rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => confirm("DELETE", task)}
                  className="px-3 py-1 flex items-center gap-1 text-sm bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </Button>
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
          </div>
        ))}
      </div>

      <ConfirmDialog />
    </div>
  );
};

export default TaskList;
