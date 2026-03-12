import { Link } from "react-router-dom"
// import type { Category } from "../types/category"

// interface Props {
//   category: Category
// }

const Card = ({ user }: any) => {
  return (
    <Link
      to={`/profile/${user.id}`}
      className="p-6 bg-white shadow rounded-xl text-center 
        hover:scale-105 transition"
    >
      {user.name}
    </Link>
  )
}

export default Card
