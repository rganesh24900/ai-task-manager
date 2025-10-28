import { useQuery } from "@tanstack/react-query"
import type { Task } from "../../types"
import { getTasks } from "../../api/tasks"
import { useNavigate } from "react-router-dom"

const useTasks = () => {
    const navigate = useNavigate()
    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            try {
                return await getTasks();
            } catch (error: any) {
                if (error.response?.status === 401) {
                    navigate("/login");
                }
                throw error;
            }
        },
        refetchOnWindowFocus:false
    })
}

export default useTasks