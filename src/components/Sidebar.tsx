import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowCircleLeft, FaArrowCircleRight, FaUserTie } from "react-icons/fa"
import { FiFileText, FiLogOut } from "react-icons/fi"
import { GrDocumentConfig } from "react-icons/gr"
import { RiHomeHeartFill } from "react-icons/ri"
import useAuthStore from "../store/useAuthStore"
import { getCategoriesByUser } from "../service/categoryApi"
import kc from "../service/keycloak"
import type { Category } from "../types/category"

type SidebarProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const goHistory = (value: number) => {
    setOpen(false)
    navigate(value)
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    kc.logout({ redirectUri: window.location.origin })
  }

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      if (!user?.id) {
        if (isMounted) setCategories([])
        return
      }

      try {
        const data = await getCategoriesByUser(user.id)
        if (isMounted) setCategories(data)
      } catch (error) {
        console.error("Erro ao carregar categorias do menu:", error)
        if (isMounted) setCategories([])
      }
    }

    if (open) {
      void loadCategories()
    }

    return () => {
      isMounted = false
    }
  }, [open, user?.id])

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-linear-to-b from-gray-900 to-blue-800 text-white w-72 max-w-[85vw] transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-40 flex flex-col`}
    >
      <div className="mt-10 p-6 text-xl font-bold">Menu</div>

      <ul className="flex-1 space-y-4 p-6">
        <li
          onClick={() => {
            setOpen(false)
            navigate("/")
          }}
          className="flex cursor-pointer items-center gap-2 hover:text-blue-600"
        >
          <RiHomeHeartFill />
          Home
        </li>

        <li
          onClick={() => {
            setOpen(false)
            navigate(`/profile/${user?.id}`)
          }}
          className="flex cursor-pointer items-center gap-2 hover:text-blue-600"
        >
          <FaUserTie />
          Perfil
        </li>

        <li
          onClick={() => {
            setOpen(false)
            navigate(`/profile/${user?.id}/texts`)
          }}
          className="flex cursor-pointer items-center gap-2 hover:text-blue-600"
        >
          <FiFileText />
          Textos
        </li>

        <li>
          <button
            onClick={() => {
              setIsCategoriesOpen((prev) => !prev)
            }}
            className="flex w-full cursor-pointer items-center justify-between gap-2 hover:text-blue-600"
          >
            <span className="flex items-center gap-2">
              <GrDocumentConfig />
              Categorias
            </span>
            <span className="text-xs">{isCategoriesOpen ? "▲" : "▼"}</span>
          </button>

          {isCategoriesOpen && (
            <ul className="mt-2 ml-5 space-y-2 border-l border-white/20 pl-3">
              <li
                onClick={() => {
                  setOpen(false)
                  navigate(`/profile/${user?.id}/categories`)
                }}
                className="cursor-pointer text-sm hover:text-blue-300"
              >
                Ver todas
              </li>

              {categories.map((category) => (
                <li
                  key={category.id}
                  onClick={() => {
                    setOpen(false)
                    navigate(`/profile/${user?.id}/category/${category.id}`)
                  }}
                  className="cursor-pointer text-sm hover:text-blue-300"
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </li>

        <div className="mt-10 flex justify-evenly">
          <FaArrowCircleLeft className="cursor-pointer hover:text-blue-600" onClick={() => goHistory(-1)} />
          <FaArrowCircleRight className="cursor-pointer hover:text-blue-400" onClick={() => goHistory(1)} />
        </div>
      </ul>

      <div className="border-t border-white/20 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20"
        >
          <FiLogOut />
          Sair
        </button>
      </div>
    </div>
  )
}
