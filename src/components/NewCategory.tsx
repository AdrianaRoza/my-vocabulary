import { useState } from "react"
import type { Category } from "../types/category"
import { categories as initialCategories } from "../mock/categories"

const NewCategory = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCategory, setNewCategory] = useState("")

	// Create New Category
  function handleAddCategory() {
    if (!newCategory.trim()) return

    const newItem: Category = {
      id: newCategory.toLowerCase(),
      name: newCategory
    };

    setCategories([...categories, newItem])
    setNewCategory("")
  }

  return (
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
  )
}

export default NewCategory
