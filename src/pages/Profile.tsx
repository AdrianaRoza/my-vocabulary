import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { getUserById } from "../service/userApi"
import type { User } from "../types/user"

const Profile = () => {
  const { userId } = useParams()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSelectedUser = async () => {
      if (!userId) {
        if (isMounted) setSelectedUser(null)
        return
      }

      try {
        const data = await getUserById(userId)
        if (isMounted) setSelectedUser(data)
      } catch (error) {
        console.error("Erro ao carregar o perfil do usuário:", error)
        if (isMounted) setSelectedUser(null)
        toast.error("Não foi possível carregar o perfil selecionado.")
      }
    }

    void loadSelectedUser()

    return () => {
      isMounted = false
    }
  }, [userId])

  return (
    <div>
      <div className="mx-auto mt-8 max-w-4xl px-4 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {selectedUser?.name || "Perfil"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {selectedUser?.email || "Acesse categorias, palavras e textos deste usuário."}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to={`/profile/${userId}/categories/`}
          className="flex aspect-5/8 w-full items-center justify-center rounded-2xl bg-linear-to-r from-gray-900 to-blue-800 text-[clamp(0.85rem,2.5vw,1.125rem)] font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          Categorias
        </Link>

        <Link
          to={`/profile/${userId}/words`}
          className="flex aspect-5/8 w-full items-center justify-center rounded-2xl bg-linear-to-l from-gray-900 to-blue-800 text-[clamp(0.85rem,2.5vw,1.125rem)] font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          Palavras
        </Link>

        <Link
          to={`/profile/${userId}/texts`}
          className="flex aspect-5/8 w-full items-center justify-center rounded-2xl bg-linear-to-r from-blue-800 to-gray-900 text-[clamp(0.85rem,2.5vw,1.125rem)] font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          Textos
        </Link>
      </div>
    </div>
  )
}

export default Profile
