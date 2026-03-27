import { apiClient } from "./apiClient"
import type { User } from "../types/user"

export const getUserCards = async () => {
  const response = await apiClient.get<User[]>("/api/vocabulary/user/cards")
  return response.data
}

export const getUserById = async (userId: string) => {
  const response = await apiClient.get<User>(`/api/vocabulary/user/${userId}`)
  return response.data
}
