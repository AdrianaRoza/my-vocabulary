import { useState } from "react";
import CategoryCard from "../components/CategoryCard";
import { categories as initialCategories } from "../mock/categories";
import type { Category } from "../types/category";
import Navbar from "../components/Navbar";


export default function Home() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategory, setNewCategory] = useState("");

	// Create New Category
  function handleAddCategory() {
    if (!newCategory.trim()) return;

    const newItem: Category = {
      id: newCategory.toLowerCase(),
      name: newCategory
    };

    setCategories([...categories, newItem]);
    setNewCategory("");
  }

  return (
    <>
			<Navbar />
			<div className="p-4">
				{/* Criar categoria */}
				<div className="mb-6 flex gap-2">
					<input
						value={newCategory}
						onChange={(e) => setNewCategory(e.target.value)}
						placeholder="New category"
						className="border p-2 rounded"
					/>
					<button
						onClick={handleAddCategory}
						className="bg-blue-500 text-white px-4 rounded"
					>
						Create
					</button>
				</div>

				{/* Lista */}
				<div className="grid grid-cols-2 gap-4">
					{categories.map((category) => (
						<CategoryCard key={category.id} category={category} />
					))}
				</div>
			</div>
		
		</>
  )
}