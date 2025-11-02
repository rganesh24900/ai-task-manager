// src/hooks/auth/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            localStorage.clear(); // optional cleanup
            navigate("/login"); // redirect to login page
        },
        onError: (err) => {
            console.error("Logout failed:", err);
        },
    });
};

export default useLogout;
