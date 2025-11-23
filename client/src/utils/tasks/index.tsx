import type { ElementType } from "react";
import TaskCreateForm from "../../components/tasks/CreateTaskForm";
import EditTaskForm from "../../components/tasks/EditTaskForm";
import DeleteTaskConfirm from "../../components/tasks/DeleteTaskConfirm";
import type { ColumnType } from "../../types";
import { CheckCircle, Circle, Timer } from "lucide-react";


export const taskPopup: Record<string, { component: ElementType, props?: any, header: string, confirmText: string, cancelText: string }> = {
    CREATE: {
        component: TaskCreateForm,
        header: "Create New Task",
        confirmText: "Save Task",
        cancelText: "Cancel",
    },
    UPDATE: {
        component: EditTaskForm,
        header: "Edit Task",
        confirmText: "Update",
        cancelText: "Close",
    },
    DELETE: {
        component: DeleteTaskConfirm,
        header: "Delete Task?",
        confirmText: "Yes, Delete",
        cancelText: "No",
    },
};

export const TaskColumnMap: Record<ColumnType, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done"
}

export function toLocalInputValue(dateString: string) {
    const d = new Date(dateString);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
}

export function toUTC(localDateString: string) {
    return new Date(localDateString).toISOString();
}

export const getStatusBadge = (status: string) => {
    switch (status) {
        case "TODO":
            return (
                <span className="flex items-center gap-1 px-2 ppy-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                    <Circle className="w-3 h-3" /> TODO
                </span>
            );
        case "IN_PROGRESS":
            return (
                <span title="In Progress" className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium max-sm:max-w-14 truncate">
                    <Timer className="w-3 h-3" /> In Progress
                </span>
            );
        case "DONE":
            return (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                    <CheckCircle className="w-3 h-3" /> Done
                </span>
            );
    }
};
