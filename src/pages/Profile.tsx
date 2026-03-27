import { Link } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const Profile = () => {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to={`/profile/${user?.id}/categories/`}
          className="flex aspect-5/8 w-full items-center justify-center rounded-2xl bg-linear-to-r from-gray-900 to-blue-800 text-[clamp(0.85rem,2.5vw,1.125rem)] font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          Categorias
        </Link>

        <Link
          to={`/profile/${user?.id}/texts`}
          className="flex aspect-5/8 w-full items-center justify-center rounded-2xl bg-linear-to-l from-gray-900 to-blue-800 text-[clamp(0.85rem,2.5vw,1.125rem)] font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
        >
          Textos
        </Link>

        <div
          className="flex aspect-5/8 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-[clamp(0.85rem,2.5vw,1.125rem)] font-medium text-slate-500 shadow-sm"
        >
          Em breve
        </div>
      </div>
    </div>
  )
}

export default Profile
