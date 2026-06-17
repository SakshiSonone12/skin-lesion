import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60s for model inference
})

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('dermai_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dermai_token')
      localStorage.removeItem('dermai_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default API
