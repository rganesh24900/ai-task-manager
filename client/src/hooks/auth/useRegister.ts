import { useMutation } from '@tanstack/react-query';
import type { RegisterData } from '../../types';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

export const useRegister = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data: RegisterData) => register(data), onSuccess: () => {
            navigate("/login")
        }
    });
};
