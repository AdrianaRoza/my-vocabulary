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
      className="p-6 bg-white shadow rounded-xl text-center 
        hover:scale-105 transition"
    >
      {category.name}
    </Link>
  )
}

export default CategoryCard
