import React, { useState, useEffect } from "react";
import type { Task } from "../../types";
import { Field, Form, Formik } from "formik";

interface EditTaskFormProps {
    formData: Task;
    setopen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (data: Task) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ formData, onSubmit }) => {
    const [task, setTask] = useState<Task>(formData);

    useEffect(() => {
        if (!formData) return;

        const formatted = formData.dueDate
            ? new Date(formData.dueDate).toISOString().slice(0, 16) // yyyy-MM-ddTHH:mm
            : "";
        console.log({ formatted })
        setTask({ ...formData, dueDate: formatted });
    }, [formData]);




    return (
        <Formik
            enableReinitialize
            initialValues={{
                id:task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate || "",
                time: task.time,
                status: task.status
            }}

            onSubmit={(values) => {
                const { dueDate, ...rest } = values;
                const convertedDate = task.dueDate ? new Date(task.dueDate).toISOString() : undefined
                onSubmit({ ...rest, dueDate: convertedDate } as unknown as Task);
            }}
        >
            {({ values, setFieldValue }) => {

                return (
                    <Form
                        className="flex flex-col gap-4 p-4"
                    >
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label> <Field
                                type="text"
                                name="title"
                                placeholder="Task Title"
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Field
                                as="textarea"
                                name="description"
                                placeholder="Description"
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <Field
                                as="select"
                                name="status"
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </Field>
                        </div>
                        {/* Priority + Reminder */}
                        <div className="flex gap-3 flex-col">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <Field
                                    as="select"
                                    name="priority"
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </Field>
                            </div>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                value={values.dueDate}
                                onChange={(e) => setFieldValue("dueDate", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            />


                        </div>
                    </Form>
                )

            }}
        </Formik>

    );
};

export default EditTaskForm;
