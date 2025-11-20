import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { Columns, ColumnType, Task } from "../../types";
import useTasks from "../../hooks/tasks/useTasks";


export default function KanbanBoard() {
    const { data: tasks, isLoading, isError, error } = useTasks();
    const mappedTasks = tasks?.reduce((acc, el) => {
        if (acc[el.status]) {
            acc[el.status].push(el)
        }
        else {
            acc[el.status] = [el]
        }
        return acc
    }, { TODO: [], IN_PROGRESS: [], DONE: [] } as Record<ColumnType, Task[]>)
    const [columns, setColumns] = useState<Columns>(mappedTasks);

    useEffect(() => {
        if (mappedTasks) {
            setColumns(mappedTasks)
        }
    }, [JSON.stringify(mappedTasks)])

    const onDragEnd = (result: DropResult<string>) => {
        const { source, destination } = result;

        // If dropped outside any column
        if (!destination) return;

        // If position not changed
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

    };

    return (
        <div className="min-h-screen bg-white p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Kanban Board</h1>

            {isLoading && <p className="text-center text-gray-500 mt-10">Loading...</p>}
            {isError && (
                <p className="text-center text-red-500 mt-10">
                    Error: {(error as Error).message}
                </p>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-6">
                    {columns && Object.entries(columns).map(([columnId, tasks]) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided) => (
                                <div
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[60vh]"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h2 className="text-lg font-semibold mb-4 capitalize">
                                        {columnId}
                                    </h2>

                                    {tasks.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id || "0"}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`
                            p-3 mb-3 rounded-lg shadow-sm bg-white border 
                            transition 
                            ${snapshot.isDragging ? "shadow-lg scale-[1.02]" : ""}`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {task.title}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}