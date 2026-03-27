import { apiClient } from "./apiClient"
import type { Category } from "../types/category"

type CreateCategoryPayload = {
  name: string
  userId: string
}

type UpdateCategoryPayload = {
  categoryId: string
  name: string
  userId: string
}

type DeleteCategoryPayload = {
  categoryId: string
  userId: string
}

type CategoryMutationResponse = {
  detail?: string
}

export const getCategoriesByUser = async (userId: string) => {
  const response = await apiClient.get<Category[]>(
    "/api/vocabulary/category/categories_by_user",
    {
      params: {
        user_id: userId,
      },
    }
  )

  return response.data
}

export const createCategory = async ({ name, userId }: CreateCategoryPayload) => {
  const response = await apiClient.post<CategoryMutationResponse>("/api/vocabulary/category", {
    name,
    user_id: userId,
  })

  return response.data
}

export const updateCategory = async ({ categoryId, name, userId }: UpdateCategoryPayload) => {
  const response = await apiClient.put<CategoryMutationResponse>(`/api/vocabulary/category/${categoryId}`, {
    name,
    user_id: userId,
  })

  return response.data
}

export const deleteCategory = async ({ categoryId, userId }: DeleteCategoryPayload) => {
  const response = await apiClient.delete<CategoryMutationResponse>(`/api/vocabulary/category/${categoryId}`, {
    data: {
      user_id: userId,
    },
  })

  return response.data
}
