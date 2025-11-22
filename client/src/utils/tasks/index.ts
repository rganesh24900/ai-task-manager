import type { ElementType } from "react";
import TaskCreateForm from "../../components/tasks/CreateTaskForm";
import EditTaskForm from "../../components/tasks/EditTaskForm";
import DeleteTaskConfirm from "../../components/tasks/DeleteTaskConfirm";
import type { ColumnType } from "../../types";


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