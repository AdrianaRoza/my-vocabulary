import { CiEdit } from "react-icons/ci"
import { MdDeleteOutline } from "react-icons/md"
import { Link } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
import type { Category } from "../types/category"

interface Props {
  category: Category
  onEdit: (category: Category) => Promise<void>
  onDelete: (category: Category) => Promise<void>
}

const CategoryCard = ({ category, onEdit, onDelete }: Props) => {
  const { user } = useAuthStore()

  return (
    <div className="relative w-full aspect-5/8">
      <Link
        to={`/profile/${user?.id}/category/${category.id}`}
        className="rounded-2xl w-full h-full bg-linear-to-l from-gray-900 to-blue-800 text-white shadow-lg p-4 flex justify-center items-center hover:scale-105 hover:shadow-2xl transition"
      >
        <p className="font-semibold leading-tight text-center whitespace-nowrap text-[clamp(0.78rem,2.5vw,1.25rem)]">
          {category.name}
        </p>
      </Link>

      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void onEdit(category)
          }}
          className="rounded-full bg-white/90 p-2 text-gray-900 shadow hover:bg-white"
          aria-label={`Editar categoria ${category.name}`}
        >
          <CiEdit />
        </button>

        <button
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void onDelete(category)
          }}
          className="rounded-full bg-white/90 p-2 text-gray-900 shadow hover:bg-white"
          aria-label={`Excluir categoria ${category.name}`}
        >
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  )
}

export default CategoryCard
