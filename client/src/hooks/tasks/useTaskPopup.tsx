import { useState } from "react";
import { taskPopup } from "../../utils/tasks";
import Modal from "../../common/components/Modal";
import useTaskAction from "./useTaskAction";
import type { ActionType, Task } from "../../types";

interface PopupConfig {
    component: React.ComponentType<any>;
    header?: string;
    confirmText?: string;
    cancelText?: string;
    props?: Record<string, any>;
}

export const useTaskPopup = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [action, setAction] = useState<ActionType | "">("");
    const { mutate: actionTaskMutate } = useTaskAction();


    const handleSubmit = async (data: Task) => {
        action && actionTaskMutate({ payload: { ...data }, action }, {
            onSuccess: () => {
                setOpen(false)
            }
        })
    };

    const confirm = (actionType: ActionType, payload?: any) => {
        setAction(actionType);
        setFormData(payload || null);
        setOpen(true);
    };

    const ConfirmDialog = () => {
        if (!open || !taskPopup[action]) return null;

        const { component: TaskComp, header, confirmText, cancelText, props } =
            taskPopup[action] as PopupConfig;

        return (
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                header={<h2 className="text-lg font-semibold">{header}</h2>}
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                        >
                            {cancelText || "Cancel"}
                        </button>
                        <button
                            onClick={() =>
                                document
                                    .querySelector("form")
                                    ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            {confirmText || "Confirm"}
                        </button>
                    </div>
                }
            >
                <TaskComp
                    formData={formData}
                    setFormData={setFormData}
                    setOpen={setOpen}
                    onSubmit={handleSubmit}
                    {...props}
                />
            </Modal>
        );
    };

    return { confirm, ConfirmDialog };
};
