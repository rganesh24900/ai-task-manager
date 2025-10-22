import type { Task } from '../types'
import api from './axios'

export const getTasks = async (): Promise<Task[]> => {
    const res = await api.get('/tasks')
    return res.data
}
