import { useEffect, useMemo, useState } from "react"
import { FolderPlus, Layers3 } from "lucide-react"
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Estamos criando sua nova categoria")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const hasCategories = categories.length > 0

  const showTimedScreen = (type: "success" | "error", message: string) => {
    if (type === "success") {
      setSuccessMessage(message)
    } else {
      setErrorMessage(message)
    }

    window.setTimeout(() => {
      if (type === "success") {
        setSuccessMessage("")
      } else {
        setErrorMessage("")
      }
    }, 1600)
  }

  const pageSummary = useMemo(() => {
    if (!hasCategories) {
      return "Crie categorias para organizar as palavras por contexto e montar uma trilha de estudo mais clara."
    }

    return `${categories.length} categoria${categories.length > 1 ? "s" : ""} disponivel${categories.length > 1 ? "eis" : ""} para separar seu vocabulario por tema.`
  }, [categories.length, hasCategories])

  // Recarrega a lista de categorias sempre que uma nova categoria for criada.
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

    try {
      setShowForm(false)
      setLoadingMessage("Estamos criando sua nova categoria")
      setIsLoading(true)

      const response = await createCategory({
        name: newCategory.trim(),
        userId,
      })

      setNewCategory("")
      await fetchCategories()
      showTimedScreen("success", response.detail ?? "Sua categoria foi criada com sucesso.")
    } catch (error) {
      console.error("Erro ao criar categoria:", error)
      showTimedScreen("error", "Não foi possível criar a categoria.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCategory = async (category: Category) => {
    setEditingCategory(category)
    setEditingCategoryName(category.name)
  }

  const confirmEditCategory = async () => {
    if (!editingCategory || !userId) {
      toast.error("Usuário inválido.")
      return
    }

    const nextName = editingCategoryName.trim()
    if (!nextName || nextName === editingCategory.name) {
      setEditingCategory(null)
      setEditingCategoryName("")
      return
    }

    setEditingCategory(null)
    setEditingCategoryName("")
    setLoadingMessage("Estamos atualizando sua categoria")
    setIsLoading(true)

    try {
      const response = await updateCategory({
        categoryId: editingCategory.id,
        name: nextName,
        userId,
      })

      await fetchCategories()
      showTimedScreen("success", response.detail ?? "Sua categoria foi atualizada com sucesso.")
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
      showTimedScreen("error", "Não foi possível atualizar a categoria.")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteCategory = async () => {
    if (!pendingDeleteCategory || !userId) {
      toast.error("Usuário inválido.")
      return
    }

    const category = pendingDeleteCategory
    setPendingDeleteCategory(null)

    setLoadingMessage("Estamos removendo sua categoria")
    setIsLoading(true)

    try {
      const response = await deleteCategory({
        categoryId: category.id,
        userId,
      })

      await fetchCategories()
      showTimedScreen("success", response.detail ?? "Sua categoria foi removida com sucesso.")
    } catch (error) {
      console.error("Erro ao excluir categoria:", error)
      showTimedScreen("error", "Não foi possível excluir a categoria.")
    } finally {
      setIsLoading(false)
    }
  }

  const closeEditCategoryModal = () => {
    setEditingCategory(null)
    setEditingCategoryName("")
  }

  const closeDeleteCategoryModal = () => {
    setPendingDeleteCategory(null)
  }

  const handleDeleteCategoryLegacyGuard = async (category: Category) => {
    if (!userId) {
      toast.error("Usuário inválido.")
      return
    }
    setPendingDeleteCategory(category)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6">
      {isLoading && (
        <LoadingScreen
          title="Quase lá..."
          content={loadingMessage}
        />
      )}

      {!isLoading && successMessage && (
        <LoadingScreen
          title="Tudo certo"
          content={successMessage}
          variant="success"
        />
      )}

      {!isLoading && errorMessage && (
        <LoadingScreen
          title="Nao foi possivel concluir"
          content={errorMessage}
          variant="error"
        />
      )}

      <section className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-blue-900 text-white shadow-xl">
        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.35fr_0.95fr] md:px-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Categories</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Organize seu vocabulario por tema antes de estudar.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              {pageSummary}
            </p>
          </div>

          <div className="grid gap-3 self-start rounded-[1.75rem] bg-white/8 p-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-slate-900 transition hover:scale-[1.01]"
            >
              <span>
                <span className="block text-sm font-semibold">Nova categoria</span>
                <span className="block text-xs text-slate-500">Crie um novo grupo para suas palavras</span>
              </span>
              <FolderPlus className="h-5 w-5 text-blue-700" />
            </button>

            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/30 px-4 py-3">
              <span>
                <span className="block text-xs uppercase tracking-[0.22em] text-blue-200">Total atual</span>
                <span className="block text-lg font-semibold text-white">{categories.length}</span>
              </span>
              <Layers3 className="h-5 w-5 text-blue-200" />
            </div>
          </div>
        </div>
      </section>

      <Grid>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategoryLegacyGuard}
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

      <CreateItemModal
        title="Editar categoria"
        placeholder="Digite o novo nome da categoria"
        value={editingCategoryName}
        isOpen={Boolean(editingCategory)}
        onChange={setEditingCategoryName}
        onConfirm={confirmEditCategory}
        onClose={closeEditCategoryModal}
        confirmLabel="Salvar alteracoes"
        isConfirmDisabled={!editingCategoryName.trim()}
      />

      <CreateItemModal
        title="Excluir categoria"
        isOpen={Boolean(pendingDeleteCategory)}
        onConfirm={confirmDeleteCategory}
        onClose={closeDeleteCategoryModal}
        confirmLabel="Excluir categoria"
      >
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            Tem certeza de que deseja excluir a categoria{" "}
            <span className="font-semibold text-slate-900">{pendingDeleteCategory?.name}</span>?
          </p>
          <p>Essa ação remove a categoria da lista vinculada ao usuário atual.</p>
        </div>
      </CreateItemModal>
    </div>
  )
}

export default Categories
