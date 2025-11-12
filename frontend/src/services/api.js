import axios from 'axios'

// Set base URL for production vs development
const baseURL = import.meta.env.PROD 
  ? '/api'  // Production: use relative path for Vercel
  : 'http://localhost:5000/api'  // Development: use localhost

const api = axios.create({ baseURL })

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
