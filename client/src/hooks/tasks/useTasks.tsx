import { useQuery } from "@tanstack/react-query"
import type { Task } from "../../types"
import { getTasks } from "../../api/tasks"

const useTasks = () => {
    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: getTasks
    })
}

export default useTasks