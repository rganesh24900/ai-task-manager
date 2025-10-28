import { FormEvent } from "react";
import type { Task } from "../../types";

interface TaskCreateFormProps {
    onSubmit: (data: Task) => void;
    formRef: React.RefObject<HTMLFormElement>;
    initialData?: Task;
}

const TaskCreateForm = ({ onSubmit, formRef }: TaskCreateFormProps) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data:Task = {
            title: form.title.value,
            description: form.description.value,
            reminderAt: form.reminderAt.value,
            priority: form.priority.value,
        };
        onSubmit(data);
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                name="title"
                placeholder="Title"
                required
                className="border p-2 rounded-md"
            />
            <textarea
                name="description"
                placeholder="Description"
                className="border p-2 rounded-md"
            />
            <input
                type="datetime-local"
                name="reminderAt"
                className="border p-2 rounded-md"
            />
            <select name="priority" className="border p-2 rounded-md">
                <option value="">Select priority</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>
        </form>
    );
};

export default TaskCreateForm;
