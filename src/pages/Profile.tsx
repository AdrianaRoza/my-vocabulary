import { useUserStore } from "../store/userStore"
import { Link } from "react-router-dom"

const Profile = () => {
  const currentUser = useUserStore((state) => state.currentUser)


  return (
    <div className="">
      <div className="">
        Usuário logado: {currentUser?.name}
      </div>

      <div className="flex justify-center items-center gap-5">
        <Link
          to={`/profile/${currentUser?.id}/categories/`}
          className="p-6 bg-white shadow rounded-xl text-center 
            hover:scale-105 transition"
        >
          Categorias
        </Link>

        <Link
          to={`.`}
          className="p-6 bg-white shadow rounded-xl text-center 
            hover:scale-105 transition"
        >
          Classes
        </Link>
      </div>
    </div>
  )
}

export default Profile
