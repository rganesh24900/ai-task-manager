import { useRef, useEffect, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import type { ActionType, Task } from "../../types"
import Button from "../../common/components/Button"
import { Calendar, Trash } from "lucide-react"
import { getStatusBadge } from "../../utils/tasks"

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

const getColumnsFromWidth = (width: number) => {
  if (width >= 1024) return 3
  if (width >= 640) return 2
  return 1
}

/* ---------------------------------- */
/* Main Component                     */
/* ---------------------------------- */

const TaskCard = ({
  filteredTasks,
  confirm,
}: {
  filteredTasks: Task[]
  confirm: (actionType: ActionType, payload?: any) => void
}) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const [columns, setColumns] = useState(() =>
    getColumnsFromWidth(window.innerWidth)
  )

  /* Handle responsive columns */
  useEffect(() => {
    const onResize = () => {
      setColumns(getColumnsFromWidth(window.innerWidth))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const rowCount = Math.ceil(filteredTasks.length / columns)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 230, // average row height
    overscan: 3,
  })

  return (
    <div
      ref={parentRef}
      className="h-[80vh] overflow-auto"
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns
          const rowItems = filteredTasks.slice(
            startIndex,
            startIndex + columns
          )

          return (
            <div
              key={virtualRow.key}
              ref={rowVirtualizer.measureElement}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-1"
              style={{
                position: "absolute",
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
              }}
            >
              {rowItems.map((task) => (
                <TaskCardItem
                  key={task.id}
                  task={task}
                  confirm={confirm}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskCard

/* ---------------------------------- */
/* Card Item                          */
/* ---------------------------------- */

const TaskCardItem = ({
  task,
  confirm,
}: {
  task: Task
  confirm: (actionType: ActionType, payload?: any) => void
}) => {
  return (
    <div className="bg-[#fafafa] border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {task.description || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="tertiary"
            onClick={() => confirm("UPDATE", task)}
            className="px-3 py-1 text-xs"
          >
            Edit
          </Button>

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

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span
          className={`px-2 py-1 rounded-md font-medium ${
            task.priority === "High"
              ? "bg-red-100 text-red-600"
              : task.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-2 whitespace-nowrap truncate">
          {getStatusBadge(task.status)}

          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
