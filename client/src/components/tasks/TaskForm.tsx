import { useState } from 'react'

interface Props {
    onTaskCreated: (title: string) => void
}

export default function TaskForm({ onTaskCreated }: Props) {
    const [title, setTitle] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title) return
        onTaskCreated(title)
        setTitle('')
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task"
                className="border rounded px-2 py-1 flex-1"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded"
            >
                Add Task
            </button>
        </form>
    )
}
