import React, { useState, useEffect } from "react";
import type { Task, Subtask } from "../../types";

interface EditTaskFormProps {
    formData: Task;
    setopen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (data: Task) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ formData, setopen, onSubmit }) => {
    const [task, setTask] = useState<Task>(formData);

    useEffect(() => {
        if (formData) setTask(formData);
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubtaskChange = (
        index: number,
        key: keyof Subtask,
        value: string | boolean
    ) => {
        setTask((prev) => {
            const updated = [...(prev.subtasks || [])];
            updated[index] = { ...updated[index], [key]: value };
            return { ...prev, subtasks: updated };
        });
    };

    const addSubtask = () => {
        setTask((prev) => ({
            ...prev,
            subtasks: [...(prev.subtasks || []), { title: "", completed: false }],
        }));
    };

    const removeSubtask = (index: number) => {
        setTask((prev) => {
            const updated = [...(prev.subtasks || [])];
            updated.splice(index, 1);
            return { ...prev, subtasks: updated };
        });
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
            <div className="flex gap-3">
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

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reminder
                    </label>
                    <input
                        type="datetime-local"
                        name="reminderAt"
                        value={
                            task.reminderAt
                                ? new Date(task.reminderAt).toISOString().slice(0, 16)
                                : ""
                        }
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>
            </div>

            {/* Subtasks */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtasks
                </label>

                <div className="flex flex-col gap-2">
                    {(task.subtasks || []).map((subtask, index) => (
                        <div
                            key={subtask.id || index}
                            className="flex items-center gap-2 border rounded-lg p-2"
                        >
                            <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={(e) =>
                                    handleSubtaskChange(index, "completed", e.target.checked)
                                }
                            />
                            <input
                                type="text"
                                value={subtask.title}
                                onChange={(e) =>
                                    handleSubtaskChange(index, "title", e.target.value)
                                }
                                placeholder={`Subtask ${index + 1}`}
                                className="flex-1 border border-gray-300 rounded-lg p-2"
                            />
                            <button
                                type="button"
                                onClick={() => removeSubtask(index)}
                                className="text-red-500 hover:text-red-700 font-semibold"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addSubtask}
                        className="text-indigo-600 text-sm mt-1 hover:underline self-start"
                    >
                        + Add Subtask
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditTaskForm;
