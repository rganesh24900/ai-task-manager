import { useMutation } from '@tanstack/react-query'
import type { LoginData } from '../../types'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

const useLogin = () => {

    const navigate = useNavigate();

    return useMutation({ mutationFn: (data: LoginData) => api.post('/auth/login', data),onSuccess:()=>{
        navigate("/")
    } })
}

export default useLogin