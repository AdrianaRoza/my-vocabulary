import { create } from "zustand"

interface User {
  id: string
  name: string
}

interface UserStore {
  currentUser: User | null
  setCurrentUser: (user: User) => void
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user })
}))
