import { useUserStore } from "../store/userStore"
import { Link } from "react-router-dom"

const Profile = () => {
  const currentUser = useUserStore((state) => state.currentUser)


  return (
    <div className="">
      <div className="text-lg font-semibold">
        Usuário logado: {currentUser?.name}
      </div>

      <div className="flex justify-center gap-6 mt-10">
        <Link
          to={`/profile/${currentUser?.id}/categories/`}
          className="w-40 h-56 rounded-2xl 
          bg-linear-to-r from bg-gray-900 to-blue-800 
          text-white shadow-lg
          flex items-center justify-center text-lg font-medium
          hover:scale-105 hover:shadow-2xl transition"
        >
          Categorias
        </Link>

        <Link
          to={`.`}
          className="w-40 h-56 rounded-2xl 
          bg-linear-to-l from bg-gray-900 to-blue-800 
          text-white shadow-lg
          flex items-center justify-center text-lg font-medium
          hover:scale-105 hover:shadow-2xl transition"
        >
          Classes
        </Link>
      </div>
    </div>
  )
}

export default Profile
