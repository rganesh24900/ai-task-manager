import type { Task } from '../types'
import api from './axios'

export const getTasks = async (): Promise<Task[]> => {
    const res = await api.get('/tasks')
    return res.data
}
export const createTask = async (payload:Task) => {
    const res = await api.post('/tasks', { data: payload })
    return res.data
}
export const deleteTask = async (payload:Task) => {
    const res = await api.delete('/tasks', { data: payload })
    return res.data
}

export const updateTask = async (payload:Task) => {
    const res = await api.put(`/tasks/${payload.id}`, { data: payload })
    return res.data
}
