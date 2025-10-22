import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import type { RegisterData } from '../../types';

export const useRegister = () => {
    return useMutation({ mutationFn: (data: RegisterData) => api.post('/register', data) });
};
