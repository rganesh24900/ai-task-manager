import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import type { RegisterData } from '../../types';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
    const navigate = useNavigate();
    return useMutation({ mutationFn: (data: RegisterData) => api.post('/auth/register', data),onSuccess:()=>{
        navigate("/login")
    } });
};
