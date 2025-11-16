import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useToggleComplete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            const res = await axios.put(`/api/tasks/${id}`, { completed });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (err) => {
            console.error("Failed to toggle task", err);
        },
    });
};

export default useToggleComplete;
