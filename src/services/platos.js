import api from './api'

export const getPlatos = () => api.get('/platos')
export const getPlato = (id) => api.get(`/platos/${id}`)
export const createPlato = (data) => api.post('/platos', data)
export const updatePlato = (id, data) => api.put(`/platos/${id}`, data)
export const deletePlato = (id) => api.delete(`/platos/${id}`)