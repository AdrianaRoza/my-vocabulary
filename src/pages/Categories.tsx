import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import CategoryCard from "../components/CategoryCard"
import CreateItemModal from "../components/CreateItemModal"
import Grid from "../components/Grid"
import LoadingScreen from "../components/LoadingScreen"
import { createCategory, deleteCategory, getCategoriesByUser, updateCategory } from "../service/categoryApi"
import type { Category } from "../types/category"

const Categories = () => {
  const { userId } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Estamos criando sua nova categoria")

  const fetchCategories = async () => {
    if (!userId) return

    try {
      const data = await getCategoriesByUser(userId)
      setCategories(data)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      toast.error("Não foi possível carregar as categorias.")
    }
  }

  useEffect(() => {
    void fetchCategories()
  }, [userId])

  const addNewCategory = async () => {
    if (!newCategory.trim()) {
      toast.warning("O campo não pode ser vazio.")
      return
    }

    if (!userId) {
      toast.error("Usuário inválido para criação da categoria.")
      return
    }

    setLoadingMessage("Estamos criando sua nova categoria")
    setIsLoading(true)

    try {
      setShowForm(false)
      const response = await createCategory({
        name: newCategory.trim(),
        userId,
      })

      toast.success(response.detail ?? "Categoria criada com sucesso.")
      setNewCategory("")
      await fetchCategories()
    } catch (error) {
      toast.error("Não foi possível criar a categoria.")
      console.error("Erro ao criar categoria:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = async (category: Category) => {
    if (!userId) {
      toast.error("Usuário inválido.")
      return
    }

    const nextName = window.prompt("Editar categoria:", category.name)?.trim()
    if (!nextName || nextName === category.name) return

    setLoadingMessage("Estamos atualizando sua categoria")
    setIsLoading(true)

    try {
      const response = await updateCategory({
        categoryId: category.id,
        name: nextName,
        userId,
      })

      toast.success(response.detail ?? "Categoria atualizada com sucesso.")
      await fetchCategories()
    } catch (error) {
      toast.error("Não foi possível atualizar a categoria.")
      console.error("Erro ao atualizar categoria:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    if (!userId) {
      toast.error("Usuário inválido.")
      return
    }

    const confirmed = window.confirm(`Deseja excluir a categoria "${category.name}"?`)
    if (!confirmed) return

    setLoadingMessage("Estamos removendo sua categoria")
    setIsLoading(true)

    try {
      const response = await deleteCategory({
        categoryId: category.id,
        userId,
      })

      toast.success(response.detail ?? "Categoria removida com sucesso.")
      await fetchCategories()
    } catch (error) {
      toast.error("Não foi possível excluir a categoria.")
      console.error("Erro ao excluir categoria:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {isLoading && (
        <LoadingScreen
          title="Quase lá..."
          content={loadingMessage}
        />
      )}

      <button
        onClick={() => setShowForm(true)}
        className="bg-linear-to-l from-gray-900 to-blue-800 text-white px-4 py-2 rounded ml-3"
      >
        + Adicionar Categoria
      </button>

      <Grid>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </Grid>

      {!isLoading && categories.length === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Nenhuma categoria encontrada para este usuário.
        </div>
      )}

      <CreateItemModal
        title="Nova Categoria"
        placeholder="Digite o nome da categoria"
        value={newCategory}
        isOpen={showForm}
        onChange={setNewCategory}
        onConfirm={addNewCategory}
        onClose={() => setShowForm(false)}
      />
    </div>
  )
}

export default Categories
