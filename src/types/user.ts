export interface User {
  name: string
  id?: string
  username?: string | null
  email?: string | null
  enabled?: boolean
  categoriesCount?: number
  wordsCount?: number
  textsCount?: number
}
