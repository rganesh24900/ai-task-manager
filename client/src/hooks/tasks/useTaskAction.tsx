import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, getTasks, updateTask } from '../../api/tasks'
import type { ActionType, Task } from '../../types'

const taskActions: Record<ActionType, { api: (payload: Task) => Promise<any> }> = {
    CREATE: {
        api: (payload: Task) => createTask(payload)
    },
    UPDATE: {
        api: (payload: Task) => updateTask(payload)
    }
}

const useTaskAction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ payload, action }: { payload: Task, action: ActionType }) => taskActions[action].api(payload),
        onSuccess: async () => {
            queryClient.invalidateQueries(["tasks"]);
        },
        onError: (err) => {
            console.error("Task action failed:", err);
        },
    })
}

export default useTaskAction