import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialData = {
    todo: [
        { id: "task-1", text: "Create project structure" },
        { id: "task-2", text: "Set up Auth" },
    ],
    inprogress: [
        { id: "task-3", text: "Design UI screens" },
    ],
    done: [
        { id: "task-4", text: "Write documentation" },
    ],
};

export default function KanbanBoard() {
    const [columns, setColumns] = useState(initialData);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If dropped outside any column
        if (!destination) return;

        // If position not changed
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

        const sourceCol = [...columns[source.droppableId]];
        const destCol = [...columns[destination.droppableId]];

        const [movedTask] = sourceCol.splice(source.index, 1);

        // If moved inside same column
        if (source.droppableId === destination.droppableId) {
            sourceCol.splice(destination.index, 0, movedTask);
            setColumns({
                ...columns,
                [source.droppableId]: sourceCol,
            });
        } else {
            // Moving to another column
            destCol.splice(destination.index, 0, movedTask);
            setColumns({
                ...columns,
                [source.droppableId]: sourceCol,
                [destination.droppableId]: destCol,
            });
        }
    };

    return (
        <div className="min-h-screen bg-white p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Kanban Board</h1>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-6">
                    {Object.entries(columns).map(([columnId, tasks]) => (
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
                                            draggableId={task.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`
                            p-3 mb-3 rounded-lg shadow-sm bg-white border 
                            transition 
                            ${snapshot.isDragging ? "shadow-lg scale-[1.02]" : ""}
                          `}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {task.text}
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