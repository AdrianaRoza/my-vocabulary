import axios from "axios"

const BASE_URL_API = import.meta.env.VITE_BASE_URL_API

// Cliente HTTP base usado pelos serviços da aplicação.
export const apiClient = axios.create({
  baseURL: BASE_URL_API,
})
