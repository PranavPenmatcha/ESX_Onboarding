import axios from 'axios'
import { OnboardingData } from '../types/onboarding'

const API_BASE_URL = 'http://localhost:9091'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const submitOnboarding = async (data: OnboardingData) => {
  try {
    const response = await api.post('/api/onboarding', data)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getOnboardingStats = async () => {
  try {
    const response = await api.get('/api/onboarding/stats')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default api
