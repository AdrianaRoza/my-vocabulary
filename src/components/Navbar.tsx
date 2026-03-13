import { useUserStore } from "../store/userStore"

const Navbar = () => {
  const currentUser = useUserStore((state) => state.currentUser)
  return (
    <>
      {/* NAVBAR */}
      <nav 
        className="bg-gray-900 text-white p-4 w-full"
      >
        <div 
          className="relative flex justify-end"
        >

          {/* Nome centralizado */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            My Vocabulary

          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            {currentUser?.name}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar