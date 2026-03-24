import { useState } from "react"
import { Menu } from "lucide-react"
import useAuthStore from "../store/useAuthStore"
import { IoCloseSharp } from "react-icons/io5"
import Sidebar from "./Sidebar"

const Navbar = () => {
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)
  // Usa o nome retornado pela autenticação; se não existir, mostra um fallback.
  const userName = user?.name?.trim() || "Usuário"

  return (
    <>
      <nav className="bg-gray-900 text-white px-4 py-3 w-full">
        <div className="flex items-center justify-between gap-3">
          {/* BOTÃO MENU */}
          <div className="w-8 flex justify-start">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="hover:cursor-pointer"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <IoCloseSharp size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* TÍTULO */}
          <div className="min-w-0 flex-1 text-center">
            <h1 className="font-semibold whitespace-nowrap text-[clamp(0.7rem,2.8vw,1.5rem)]">
              My Vocabulary
            </h1>
          </div>

          {/* USUÁRIO */}
          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
            <div className="w-2 h-2 bg-green-600 rounded-full shrink-0"></div>
            <span className="leading-none whitespace-nowrap text-[clamp(0.45rem,2.4vw,0.875rem)]">
              {userName}
            </span>
          </div>
        </div>
      </nav>

      {open && (
        <button
          className="fixed inset-0 bg-black/35 z-30"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu lateral"
        />
      )}

      <Sidebar
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}

export default Navbar
