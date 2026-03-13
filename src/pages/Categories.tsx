import { useParams } from "react-router-dom"
import { categories } from "../mock/categories"
import CategoryCard from "../components/CategoryCard"
import { useState } from "react"


const Categories = () => {
  const { userId } = useParams()

  const filteredCategory = categories.filter( category =>
    category.userId.includes(userId || '')
  )

	const [words, setWords] = useState<string[]>([])
	const [newWord, setNewWord] = useState("")
	const [showForm, setShowForm] = useState(false)

	const addWord = () => {
  if (!newWord) return

  setWords([...words, newWord])
  setNewWord("")
  setShowForm(false)
}

	return (
		
		<div className="ml-4">
			<button
				onClick={() => setShowForm(true)}
				className="bg-linear-to-l from-gray-900 to-blue-800 
					text-white px-4 py-2 rounded ml-3"
				>
				+ Adicionar Categoria
			</button>

			{/* Lista */}
				<div className="grid  grid-cols-4 mt-6 ml-3 gap-4">

					{words.map((word, index) => (
						<div
							key={index}
							className="w-40 h-56 rounded-2xl 
								bg-linear-to-r from-gray-900 to-blue-800 
								text-white shadow-lg
								flex items-center justify-center text-lg font-medium
								hover:scale-105 hover:shadow-2xl transition"
						>
							{word}
						</div>
					))}

					{filteredCategory.map((category) => (
						<CategoryCard key={category.id} category={category} />
					))}

				</div>

				{showForm && (
					<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
						
						<div className="bg-white p-6 rounded shadow-lg w-80">
							
							<h2 className="text-lg font-bold mb-4">
								Nova Palavra
							</h2>

							<input
								value={newWord}
								onChange={(e) => setNewWord(e.target.value)}
								className="border w-full p-2 mb-4"
								placeholder="Digite a palavra"
							/>

							<div className="flex gap-2">
								<button
									onClick={addWord}
									className="bg-green-500 text-white px-4 py-2 rounded"
								>
									Adicionar
								</button>

								<button
									onClick={() => setShowForm(false)}
									className="bg-gray-400 text-white px-4 py-2 rounded"
								>
									Cancelar
								</button>
							</div>

						</div>
					</div>
				)}

{/* 
					{filteredCategory.map((category) => (
						<CategoryCard key={category.id} category={category} />
					))} */}
				</div>
	)
}

export default Categories
