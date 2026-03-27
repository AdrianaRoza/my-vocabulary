import { apiClient } from "./apiClient"
import type { Word } from "../types/word"

export type ImportMode = "skip" | "update" | "error"

export type PhraseImportItem = {
  english: string
  portuguese: string
}

export type WordImportItem = {
  english: string
  portuguese: string
  sentences?: PhraseImportItem[]
}

type GetWordsPayload = {
  userId: string
  categoryId: string
}

type CreateWordPayload = {
  english: string
  userId: string
  categoryId: string
}

type UpdateWordPayload = {
  wordId: string
  english: string
  userId: string
  categoryId: string
}

type DeleteWordPayload = {
  wordId: string
  userId: string
}

type ImportWordsPayload = {
  userId: string
  categoryId: string
  items: WordImportItem[]
  mode?: ImportMode
  schemaVersion?: "1.0"
}

type ImportWordsFromFilePayload = {
  file: File
  userId: string
  categoryId: string
  mode?: ImportMode
}

type WordMutationResponse = {
  detail?: string
}

export type WordImportResponse = {
  total: number
  created: number
  linked: number
  updated: number
  skipped: number
  failed: number
  errors: Array<{
    index: number
    english: string
    reason: string
  }>
}

export const getWordsByCategory = async ({ userId, categoryId }: GetWordsPayload) => {
  const response = await apiClient.get<Word[]>("/api/vocabulary/word/words", {
    params: {
      user_id: userId,
      category_id: categoryId,
    },
  })

  return response.data
}

export const createWord = async ({ english, userId, categoryId }: CreateWordPayload) => {
  const response = await apiClient.post<WordMutationResponse>("/api/vocabulary/word", {
    english,
    user_id: userId,
    category_id: categoryId,
  })

  return response.data
}

export const updateWord = async ({ wordId, english, userId, categoryId }: UpdateWordPayload) => {
  const response = await apiClient.put<WordMutationResponse>(`/api/vocabulary/word/${wordId}`, {
    english,
    user_id: userId,
    category_id: categoryId,
  })

  return response.data
}

export const deleteWord = async ({ wordId, userId }: DeleteWordPayload) => {
  const response = await apiClient.delete<WordMutationResponse>(`/api/vocabulary/word/${wordId}`, {
    data: {
      user_id: userId,
    },
  })

  return response.data
}

export const importWords = async ({ userId, categoryId, items, mode = "skip", schemaVersion = "1.0" }: ImportWordsPayload) => {
  const response = await apiClient.post<WordImportResponse>("/api/vocabulary/word/import", {
    schema_version: schemaVersion,
    user_id: userId,
    category_id: categoryId,
    mode,
    items,
  })

  return response.data
}

export const importWordsFromFile = async ({ file, userId, categoryId, mode = "skip" }: ImportWordsFromFilePayload) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("user_id", userId)
  formData.append("category_id", categoryId)
  formData.append("mode", mode)

  const response = await apiClient.post<WordImportResponse>("/api/vocabulary/word/import/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}
