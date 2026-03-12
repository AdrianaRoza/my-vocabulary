import { useParams } from "react-router-dom"
import { categories } from "../mock/categories"
import CategoryCard from "../components/CategoryCard"


const Categories = () => {
  const { userId } = useParams()

  const filteredCategory = categories.filter( category =>
    category.userId.includes(userId || '')
  )

	return (
		<div className="">
			Categorias

			{/* Lista */}
				<div className="grid grid-cols-2 gap-4">
					{filteredCategory.map((category) => (
						<CategoryCard key={category.id} category={category} />
					))}
				</div>
		</div>
	)
}

export default Categories
