import { useMutation } from '@tanstack/react-query'
import type { LoginData } from '../../types'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth';

const useLogin = () => {

    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: LoginData) => login(data), onSuccess: () => {
            navigate("/")
        }
    })
}

export default useLogin