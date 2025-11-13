import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import Button from "../../common/components/Button";
import useParseTask from "../../hooks/tasks/useParseTask";
import type { Task } from "../../types";

interface CreateTaskFormProps {
    onSubmit: (task: Task) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSubmit }) => {
    const [nlInput, setNlInput] = useState("");
    const [aiSuggestions, setAISuggestions] = useState<{
        subtasks?: { title: string; dueInDays?: number | null }[];
        actions?: string[];
    }>({});

    const { mutate: parseTask, isPending: parsing } = useParseTask();

    return (
        <Formik
            initialValues={{
                title: "",
                description: "",
                priority: "Medium",
                dueDate: "",
                time: "",
            }}
            onSubmit={(values) => {
                const { time, ...rest } = values;
                onSubmit(rest as unknown as Task);
            }}
        >
            {({ values, setFieldValue }) => {
                const handleSmartParse = () => {
                    if (!nlInput.trim()) return;
                    parseTask(nlInput, {
                        onSuccess: (parsedData: any) => {
                            const { suggestedSubtasks, suggestedNextActions, ...fields } = parsedData;

                            Object.entries(fields).forEach(([key, value]) => {
                                if (value !== undefined) setFieldValue(key, value);
                            });

                            setAISuggestions({
                                subtasks: suggestedSubtasks || [],
                                actions: suggestedNextActions || [],
                            });
                        },
                        onError: (err) => {
                            console.error("Failed to parse task:", err);
                        },
                    });
                };

                const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const date = e.target.value;
                    setFieldValue(
                        "dueDate",
                        date ? `${date}T${values.time || "00:00"}:00.000Z` : ""
                    );
                };

                const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const time = e.target.value;
                    const date = values.dueDate?.split("T")[0];
                    setFieldValue(
                        "time",
                        time
                    );
                    setFieldValue(
                        "dueDate",
                        date ? `${date}T${time}:00.000Z` : values.dueDate
                    );
                };

                return (
                    <Form className="space-y-4">
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="E.g. 'High priority meeting with John tomorrow at 5pm'"
                                value={nlInput}
                                onChange={(e) => setNlInput(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <Button
                                className="whitespace-nowrap"
                                type="button"
                                onClick={handleSmartParse}
                                disabled={parsing}
                            >
                                {parsing ? "Parsing..." : "✨ Smart Fill"}
                            </Button>
                        </div>

                        {/* 📝 Title */}
                        <Field
                            type="text"
                            name="title"
                            placeholder="Task Title"
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <Field
                            as="textarea"
                            name="description"
                            placeholder="Description"
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <Field
                            as="select"
                            name="priority"
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </Field>

                        <div className="flex gap-4">
                            <label className="flex-1 text-sm font-medium text-gray-700">
                                Due Date:
                                <input
                                    type="date"
                                    value={values.dueDate?.split("T")[0] || ""}
                                    onChange={handleDateChange}
                                    className="w-full border rounded-lg px-3 py-2 mt-1"
                                />
                            </label>

                            <label className="flex-1 text-sm font-medium text-gray-700">
                                Time:
                                <input
                                    type="time"
                                    value={values.time || ""}
                                    onChange={handleTimeChange}
                                    className="w-full border rounded-lg px-3 py-2 mt-1"
                                />
                            </label>
                        </div>

                        {(aiSuggestions.subtasks?.length || aiSuggestions.actions?.length) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                {aiSuggestions.subtasks?.length ? (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 text-gray-700">
                                            Suggested Subtasks
                                        </h4>
                                        <ul className="list-disc ml-5 text-sm text-gray-600">
                                            {aiSuggestions.subtasks.map((t, i) => (
                                                <li key={i}>{t.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {aiSuggestions.actions?.length ? (
                                    <div className="mt-3">
                                        <h4 className="font-semibold text-sm mb-2 text-gray-700">
                                            Next Actions
                                        </h4>
                                        <ul className="list-disc ml-5 text-sm text-gray-600">
                                            {aiSuggestions.actions.map((a, i) => (
                                                <li key={i}>{a}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </Form>
                );
            }}
        </Formik>
    );
};

export default CreateTaskForm;
