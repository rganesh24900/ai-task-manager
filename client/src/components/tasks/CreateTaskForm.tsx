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
                console.log({ parsedData })
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
                <Button className="whitespace-nowrap" type="button" onClick={handleSmartParse} disabled={parsing}>
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
            <div className="flex gap-4">
                <label className="flex-1 text-sm font-medium text-gray-700">
                    Due Date:
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate?.split("T")[0] || ""}
                        onChange={(e) => {
                            const date = e.target.value;
                            setFormData({
                                ...formData,
                                dueDate: date ? `${date}T${formData.time || "00:00"}:00.000Z` : "",
                            });
                        }}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                </label>
                <label className="flex-1 text-sm font-medium text-gray-700">
                    Time:
                    <input
                        type="time"
                        name="time"
                        value={formData.time || ""}
                        onChange={(e) => {
                            const time = e.target.value;
                            const date = formData.dueDate?.split("T")[0];
                            setFormData({
                                ...formData,
                                time,
                                dueDate: date ? `${date}T${time}:00.000Z` : formData.dueDate,
                            });
                        }}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                </label>
            </div>
        </form>
    );
};

export default CreateTaskForm;
