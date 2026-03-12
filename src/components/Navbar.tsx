import { useUserStore } from "../store/userStore"

const Navbar = () => {
  const currentUser = useUserStore((state) => state.currentUser)
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

          {/* Nome centralizado */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 
              text-xl font-bold"
          >
            {currentUser?.name}
          </div>

          {/* Espaço vazio para equilibrar */}
          <div className="w-6"></div>
        </div>
      </nav>
    </>
  )
}

export default Navbar