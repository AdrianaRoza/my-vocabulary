import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Expressões usadas para saber em qual tela a aplicação está.
  const profileMatch = location.pathname.match(/^\/profile\/([^/]+)\/?$/)
  const categoriesMatch = location.pathname.match(/^\/profile\/([^/]+)\/categories\/?$/)
  const wordsMatch = location.pathname.match(/^\/profile\/([^/]+)\/words\/?$/)
  const categoryMatch = location.pathname.match(/^\/profile\/([^/]+)\/category\/([^/]+)\/?$/)

  // Os botões flutuantes aparecem apenas nas telas de perfil e conteúdo.
  const showFloatingHistory =
    Boolean(profileMatch || categoriesMatch || wordsMatch || categoryMatch)

  // O botão de voltar navega para um destino conhecido, sem depender do histórico do navegador.
  let backPath: string | null = null
  // O botão de avançar existe visualmente, mas fica desabilitado enquanto não houver fluxo definido.
  const forwardPath: string | null = null

  if (profileMatch) {
    backPath = "/"
  }

  if (categoriesMatch || wordsMatch || categoryMatch) {
    const userId = categoriesMatch?.[1] || wordsMatch?.[1] || categoryMatch?.[1]
    backPath = userId ? `/profile/${userId}` : null
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
  
      {/* Área principal onde as páginas filhas são renderizadas */}
      <div className="mt-4">
        <Outlet />
      </div>

      {/* Navegação flutuante para as páginas internas do fluxo de estudo */}
      {showFloatingHistory && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-5 z-30 flex items-center gap-3 sm:bottom-6">
          <button
            onClick={() => {
              if (backPath) navigate(backPath)
            }}
            disabled={!backPath}
            className="w-11 h-11 rounded-full bg-linear-to-l from-gray-900 to-blue-800 text-white shadow-lg flex items-center justify-center hover:bg-blue-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Voltar para a página anterior"
          >
            <FaArrowCircleLeft size={18} />
          </button>

          <button
            onClick={() => {
              if (forwardPath) navigate(forwardPath)
            }}
            disabled={!forwardPath}
            className="w-11 h-11 rounded-full bg-blue-800 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Ir para a próxima página"
          >
            <FaArrowCircleRight size={18} />
          </button>
        </div>
      )}
    </>
  )
}

export default Layout
