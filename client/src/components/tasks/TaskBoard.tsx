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
        <div className="min-h-screen bg-[#fafafa] p-4 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center sm:text-left">
                Task Board
            </h1>

            {isLoading && <p className="text-center text-gray-500 mt-10">Loading...</p>}
            {isError && (
                <p className="text-center text-red-500 mt-10">
                    Error: {(error as Error).message}
                </p>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                gap-6
            ">
                    {columns &&
                        Object.entries(columns).map(([columnId, tasks]) => (
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="
                                        bg-white 
                                        rounded-2xl 
                                        shadow-sm 
                                        border 
                                        border-gray-200 
                                        p-5 
                                        min-h-[65vh]
                                        flex 
                                        flex-col
                                        transition
                                    "
                                    >
                                        <h2 className="
                                        text-lg 
                                        font-semibold 
                                        text-gray-800 
                                        mb-4 
                                        flex 
                                        justify-between 
                                        items-center
                                    ">
                                            {TaskColumnMap[columnId as ColumnType]}

                                            <span className="
                                            text-xs 
                                            px-2 
                                            py-1 
                                            rounded-full 
                                            bg-gray-100 
                                            text-gray-600
                                        ">
                                                {tasks.length} tasks
                                            </span>
                                        </h2>

                                        <div className="flex flex-col flex-1">
                                            {tasks.map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id || "0"}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`
                                                            p-4 mb-3 
                                                            rounded-xl 
                                                            shadow-sm 
                                                            border 
                                                            bg-white
                                                            text-gray-800
                                                            cursor-grab
                                                            hover:shadow-md
                                                            hover:border-gray-300
                                                            transition-all 
                                                            duration-150
                                                            ${snapshot.isDragging
                                                                    ? `shadow-xl scale-[1.03] bg-purple-50 border-purple-300`
                                                                    : ""
                                                                }
                                                        `}
                                                        >
                                                            <p className="font-medium">
                                                                {task.title}
                                                            </p>

                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {task?.priority} priority
                                                            </p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}

                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                </div>
            </DragDropContext>
        </div>
    );
}