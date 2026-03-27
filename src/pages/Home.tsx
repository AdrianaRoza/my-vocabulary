import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Card from "../components/Card"
import Grid from "../components/Grid"
import { getUserCards } from "../service/userApi"
import type { User } from "../types/user"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        if (isMounted) {
          setUsers(await getUserCards())
        }
      } catch (error) {
        console.error("Erro ao carregar os perfis:", error)
        if (isMounted) {
          setUsers([])
        }
        toast.error("Não foi possível carregar os perfis.")
      }
    }

    void loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="px-3 py-6 sm:p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 ml-5">Perfis de Usuários</h1>
      <Grid>
        {users.map((user) => (
          <Card
            key={user.id}
            user={user}
          />
        ))}
      </Grid>

      {users.length === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Nenhum perfil encontrado.
        </div>
      )}
    </div>
  )
}
