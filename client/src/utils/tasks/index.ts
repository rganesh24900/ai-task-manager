import type { ElementType } from "react";
import TaskCreateForm from "../../components/tasks/TaskCreateForm";
import EditTaskForm from "../../components/tasks/EditTaskForm";


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
    // DELETE: {
    //     component: DeleteTaskConfirm,
    //     header: "Delete Task?",
    //     confirmText: "Yes, Delete",
    //     cancelText: "No",
    // },
};