import { create } from "zustand"
import type { User } from "../types/user"

// Store global responsável por manter os dados de autenticação em memória.
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (value: boolean) => void
  updateUser: (updatedFields: Partial<User>) => void
}

const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial antes da autenticação concluir.
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  // Salva os dados do usuário assim que o login é validado.
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  // Limpa o estado local ao sair da aplicação.
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  setLoading: (value) => set({ isLoading: value }),

  // Permite atualizar apenas parte do objeto de usuário.
  updateUser: (updatedFields) => {
    const currentUser = get().user
    if (!currentUser) return
    set({ user: { ...currentUser, ...updatedFields } })
  }
}))

export default useAuthStore
