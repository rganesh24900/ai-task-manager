import { useMutation } from "@tanstack/react-query";
import { parseTask } from "../../api/tasks";


const useParseTask = () => {
    return useMutation({
        mutationFn: parseTask,
    });
};

export default useParseTask;
