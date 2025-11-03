import React, { useState, useEffect } from "react";
import type { Task, Subtask } from "../../types";

interface EditTaskFormProps {
    formData: Task;
    setopen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (data: Task) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ formData, setopen, onSubmit }) => {
    const [task, setTask] = useState<Task>(formData);
    console.log({task})

    useEffect(() => {
        if (formData) setTask(formData);
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task.title) return alert("Title is required");
        onSubmit(task)
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4"
        >
            {/* Title */}
            <label className="flex gap-1" htmlFor="">
                Title : <input
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                />
            </label>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={task.description || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
                />
            </div>

            {/* Priority + Reminder */}
            <div className="flex gap-3 flex-col">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <select
                        name="priority"
                        value={task.priority || "Medium"}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <input
                    type="datetime-local"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>
        </form>
    );
};

export default EditTaskForm;
