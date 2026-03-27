import axios from "axios"
import kc from "./keycloak"
import useAuthStore from "../store/useAuthStore"

const BASE_URL_API = import.meta.env.VITE_BASE_URL_API

// Cliente HTTP base usado pelos serviços da aplicação.
export const apiClient = axios.create({
  baseURL: BASE_URL_API,
})

apiClient.interceptors.request.use((config) => {
  const token = kc.token || useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
