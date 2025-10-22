import { useMutation } from '@tanstack/react-query'
import type { LoginData } from '../../types'
import api from '../../api/axios'

const useLogin = () => {
    return useMutation({ mutationFn: (data: LoginData) => api.post('/login', data) })
}

export default useLogin