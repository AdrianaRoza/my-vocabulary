import { apiClient } from "./apiClient"
import type { TextEntry } from "../types/text"

type GenerateTextPayload = {
  userId: string
  topic: string
}

type CreateManualTextPayload = {
  userId: string
  english: string
  portuguese: string
}

type UpdateTextPayload = {
  textId: string
  userId: string
  english: string
  portuguese: string
}

type DeleteTextPayload = {
  textId: string
  userId: string
}

type TextMutationResponse = {
  detail?: string
}

export const getTextsByUser = async (userId: string) => {
  const response = await apiClient.get<TextEntry[]>("/api/vocabulary/text/by_user", {
    params: {
      user_id: userId,
    },
  })

  return response.data
}

export const generateText = async ({ userId, topic }: GenerateTextPayload) => {
  const response = await apiClient.post<TextMutationResponse>("/api/vocabulary/text/generate", {
    user_id: userId,
    topic,
  })

  return response.data
}

export const createManualText = async ({ userId, english, portuguese }: CreateManualTextPayload) => {
  const response = await apiClient.post<TextMutationResponse>("/api/vocabulary/text/manual", {
    user_id: userId,
    english,
    portuguese,
  })

  return response.data
}

export const updateText = async ({ textId, userId, english, portuguese }: UpdateTextPayload) => {
  const response = await apiClient.put<TextMutationResponse>(`/api/vocabulary/text/${textId}`, {
    user_id: userId,
    english,
    portuguese,
  })

  return response.data
}

export const deleteText = async ({ textId, userId }: DeleteTextPayload) => {
  const response = await apiClient.delete<TextMutationResponse>(`/api/vocabulary/text/${textId}`, {
    data: {
      user_id: userId,
    },
  })

  return response.data
}
