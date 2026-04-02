import { apiClient } from "./apiClient"
import type { GrammarClassSummary } from "../types/grammarClass"
import type { Word } from "../types/word"

export const getGrammarClassesByUser = async (userId: string) => {
  const response = await apiClient.get<GrammarClassSummary[]>("/api/vocabulary/grammar-class/by_user", {
    params: {
      user_id: userId,
    },
  })

  return response.data
}

export const getWordsByGrammarClass = async (userId: string, slug: string) => {
  const response = await apiClient.get<Word[]>(`/api/vocabulary/grammar-class/${slug}/words`, {
    params: {
      user_id: userId,
    },
  })

  return response.data
}
