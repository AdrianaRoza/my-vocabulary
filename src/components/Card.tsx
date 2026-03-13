import { Link } from "react-router-dom"
// import type { Category } from "../types/category"

// interface Props {
//   category: Category
// }

const Card = ({ user }: any) => {
  return (
    <Link
      to={`/profile/${user.id}`}
      className="w-40 h-56 rounded-2xl 
          bg-gradient-to-l from bg-gray-900 to-blue-800 
          text-white shadow-lg
          flex items-center justify-center text-lg font-medium
          hover:scale-105 hover:shadow-2xl transition"
    >
      {user.name}
    </Link>
  )
}

export default Card
