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

      <div className="mx-auto mt-5 grid max-w-7xl grid-cols-2 gap-2 px-4 sm:gap-4 lg:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        <Link
          to={`/profile/${userId}/categories/`}
          className="mx-auto flex aspect-5/8 w-full md:max-w-[10.5rem] lg:max-w-[11rem] xl:max-w-[11.25rem] 2xl:max-w-[11.5rem] items-center justify-center rounded-2xl bg-linear-to-r from-gray-900 to-blue-800 px-2 sm:px-3 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          <span className="max-w-[88%] text-center text-[clamp(0.62rem,1.7vw,1rem)] leading-tight break-normal">
            Categorias
          </span>
        </Link>

        <Link
          to={`/profile/${userId}/words`}
          className="mx-auto flex aspect-5/8 w-full md:max-w-[10.5rem] lg:max-w-[11rem] xl:max-w-[11.25rem] 2xl:max-w-[11.5rem] items-center justify-center rounded-2xl bg-linear-to-l from-gray-900 to-blue-800 px-2 sm:px-3 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          <span className="max-w-[88%] text-center text-[clamp(0.62rem,1.7vw,1rem)] leading-tight break-normal">
            Palavras
          </span>
        </Link>

        <Link
          to={`/profile/${userId}/texts`}
          className="mx-auto flex aspect-5/8 w-full md:max-w-[10.5rem] lg:max-w-[11rem] xl:max-w-[11.25rem] 2xl:max-w-[11.5rem] items-center justify-center rounded-2xl bg-linear-to-r from-blue-800 to-gray-900 px-2 sm:px-3 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          <span className="max-w-[88%] text-center text-[clamp(0.62rem,1.7vw,1rem)] leading-tight break-normal">
            Textos
          </span>
        </Link>

        <Link
          to={`/profile/${userId}/grammar-classes`}
          className="mx-auto flex aspect-5/8 w-full md:max-w-[10.5rem] lg:max-w-[11rem] xl:max-w-[11.25rem] 2xl:max-w-[11.5rem] items-center justify-center rounded-2xl bg-linear-to-r from-gray-900 to-blue-800 px-2 sm:px-3 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          <span className="max-w-[88%] text-center text-[clamp(0.62rem,1.7vw,1rem)] leading-tight break-normal">
            Classes gramaticais
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Profile
