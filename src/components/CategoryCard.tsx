import { Link } from "react-router-dom"
import type { Category } from "../types/category"

interface Props {
  category: Category
}

const CategoryCard = ({ category }: Props) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="p-6 bg-white shadow rounded-xl text-center 
        hover:scale-105 transition"
    >
      {category.name}
    </Link>
  )
}

export default CategoryCard
