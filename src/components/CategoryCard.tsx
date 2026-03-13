import { Link } from "react-router-dom"
import type { Category } from "../types/category"
import { useUserStore } from "../store/userStore"

interface Props {
  category: Category
}

const CategoryCard = ({ category }: Props) => {
  const currentUser = useUserStore((state) => state.currentUser)
  
  console.log('--category--', category)

  return (
    <Link
      to={`/profile/${currentUser?.id}/category/${category.id}`}
      className="w-40 h-56 rounded-2xl 
          bg-gradient-to-l from bg-gray-900 to-blue-800 
          text-white shadow-lg
          flex items-center justify-center text-lg font-medium
          hover:scale-105 hover:shadow-2xl transition"
    >
      {category.name}
    </Link>
  )
}

export default CategoryCard
