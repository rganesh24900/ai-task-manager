import React, { useState, useMemo } from "react";
import Button from "../../common/components/Button";
import { useTaskPopup } from "../../hooks/tasks/useTaskPopup";
import useTasks from "../../hooks/tasks/useTasks";
import TaskFilter from "./TaskFilter";
import TaskCard from "./TaskCard";

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const { confirm, ConfirmDialog } = useTaskPopup();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");

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

    if (["IN_PROGRESS", "TODO", "DONE"].includes(filter))
      result = result.filter((t) => t.status == filter);
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


  return (
    <div className="min-h-screen p-4 sm:p-6 bg-[#fafafa]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
          Tasks
        </h1>

        <div className="flex w-full sm:w-auto">
          <Button
            variant="primary"
            onClick={() => confirm("CREATE")}
            className="px-5 py-2 w-full sm:w-auto"
          >
            + Create Task
          </Button>
        </div>
      </div>

      <TaskFilter
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

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

      <TaskCard filteredTasks={filteredTasks} confirm={confirm} />

      <ConfirmDialog />
    </div>

  );

};

export default TaskList;
