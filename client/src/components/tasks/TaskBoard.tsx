import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { Columns, ColumnType, Task } from "../../types";
import useTasks from "../../hooks/tasks/useTasks";
import { TaskColumnMap } from "../../utils/tasks";
import useTaskAction from "../../hooks/tasks/useTaskAction";


export default function TaskBoard() {
    const { data: tasks, isLoading, isError, error } = useTasks();
    const { mutate: actionTaskMutate } = useTaskAction();
    const emptyColumns: Columns = {
        TODO: [],
        IN_PROGRESS: [],
        DONE: []
    };
    const mappedTasks: Columns = tasks
        ? tasks.reduce((acc, el) => {
            acc[el.status].push(el);
            return acc;
        }, emptyColumns)
        : emptyColumns;
    const [columns, setColumns] = useState<Columns>(mappedTasks);
    const [movedTask, setMovedTask] = useState<Task | null>(null)

    useEffect(() => {
        if (mappedTasks && !movedTask) {
            setColumns(mappedTasks)
        }
    }, [JSON.stringify(mappedTasks)])

    useEffect(() => {
        if (!columns || !movedTask) return;
        actionTaskMutate({ payload: movedTask, action: "UPDATE" })
    }, [JSON.stringify(columns)])


    const onDragEnd = (result: DropResult<string>) => {
        const { source, destination } = result;

        if (!destination || !columns) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceKey = source.droppableId as ColumnType;
        const destKey = destination.droppableId as ColumnType;

        const sourceCol = [...columns[sourceKey]];
        const destCol = [...columns[destKey]];

        const [moved] = sourceCol.splice(source.index, 1);

        setMovedTask({
            ...moved,
            status: destKey
        });

        if (sourceKey === destKey) {
            sourceCol.splice(destination.index, 0, moved);

            setColumns(prev => ({
                ...prev,
                [sourceKey]: sourceCol
            }));
            return;
        }

        destCol.splice(destination.index, 0, moved);

        setColumns(prev => ({
            ...prev,
            [sourceKey]: sourceCol,
            [destKey]: destCol
        }));
    }

    return (
        <div className="min-h-screen bg-white p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Task Board</h1>

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
                                        {TaskColumnMap[columnId as ColumnType]}
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