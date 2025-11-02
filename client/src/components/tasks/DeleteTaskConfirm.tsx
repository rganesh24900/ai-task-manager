import React from "react";
import type { Task } from "../../types";

interface DeleteTaskConfirmProps {
    formData: Task;
    setopen: (open: boolean) => void;
    onSubmit: (data: Task) => any
}

const DeleteTaskConfirm: React.FC<DeleteTaskConfirmProps> = ({ formData, onSubmit }) => {
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
    };

    return (
        <form action="" onSubmit={handleDelete}>
            <div className="p-4">
                <p className="text-gray-700">
                    Are you sure you want to <span className="font-semibold text-red-600">delete</span> the
                    task <span className="font-semibold">"{formData?.title}"</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone.
                </p>
            </div>
        </form>
    );
};

export default DeleteTaskConfirm;
