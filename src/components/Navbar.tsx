import { useState } from "react"
import { Link } from "react-router-dom"
import { categories } from "../mock/categories"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  return (
    <>
      {/* NAVBAR */}
      <nav 
        className="bg-gray-900 text-white p-4 w-full shadow-md 
          fixed top-0 left-0 z-50"
      >
        <div 
          className="max-w-7xl mx-auto flex items-center
            justify-between relative"
        >
          
          {/* Botão Hambúrguer */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>

          {/* Nome centralizado */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 
              text-xl font-bold"
          >
            MyVocabulary
          </div>

          {/* Espaço vazio para equilibrar */}
          <div className="w-6"></div>
        </div>
      </nav>

      {/* MENU FLUTUANTE */}
          <div
            className={`fixed inset-0 z-40 transition-opacity duration-900
            ${menuOpen ? "bg-black/40 opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            <div
              className={`bg-gray-800 text-white w-64 h-full p-6 shadow-lg
              transform transition-transform duration-900
              ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
              onMouseLeave={() => {
                setMenuOpen(false)
                setCategoryOpen(false)
              }}
            >

            {/* Fechar */}
            <button
              onClick={() => {
                setMenuOpen(false)
                setCategoryOpen(false)
              }}
              className="mb-6 text-right w-full"
            >
              ✕
            </button>

            {/* Links principais */}
            <ul className="space-y-4">

              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>

              {/* CATEGORY */}
              <li>
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full text-left"
                >
                  Category ▾
                </button>

                {/* Lista dinâmica */}
                {categoryOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to={`/category/${cat.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="text-gray-300 hover:text-blue-400"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

            </ul>
          </div>
        </div>
    </>
  )
}

export default Navbar