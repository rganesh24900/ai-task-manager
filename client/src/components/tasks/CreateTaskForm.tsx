import React, { useState } from "react";
import Button from "../../common/components/Button";
import useParseTask from "../../hooks/tasks/useParseTask";
import type { Task } from "../../types";

interface CreateTaskFormProps {
    onSubmit: (task: Task) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: "",
        description: "",
        priority: "medium",
    });

    const [nlInput, setNlInput] = useState("");
    const { mutate: parseTask, isPending: parsing } = useParseTask();

    const handleSmartParse = () => {
        if (!nlInput.trim()) return;
        parseTask(nlInput, {
            onSuccess: (parsedData) => {
                // Merge parsed values into form fields
                setFormData((prev) => ({
                    ...prev,
                    ...parsedData,
                }));
            },
            onError: (err) => {
                console.error("Failed to parse task:", err);
            },
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as Task);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* 🧠 Smart Task Input */}
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="E.g. 'High priority meeting with John tomorrow at 5pm'"
                    value={nlInput}
                    onChange={(e) => setNlInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <Button type="button" onClick={handleSmartParse} disabled={parsing}>
                    {parsing ? "Parsing..." : "✨ Smart Fill"}
                </Button>
            </div>

            {/* 📝 Title */}
            <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
            />

            {/* 🧾 Description */}
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
            />

            {/* 🔥 Priority */}
            <select
                name="priority"
                value={formData.priority || "Medium"}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            {/* 🗓️ Due Date */}
            <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate?.slice(0, 16) || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
            />

            <Button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
            >
                Create Task
            </Button>
        </form>
    );
};

export default CreateTaskForm;
