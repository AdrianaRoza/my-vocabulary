import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Card from "../components/Card"
import Grid from "../components/Grid"
import  useAuthStore from "../store/useAuthStore"
import { getCategoriesByUser } from "../service/categoryApi"
import { getWordsByCategory } from "../service/wordApi"

export default function Home() {
  const { user } = useAuthStore()
  const [categoriesCount, setCategoriesCount] = useState<number | undefined>(undefined)
  const [wordsCount, setWordsCount] = useState<number | undefined>(undefined)

  useEffect(() => {
    let isMounted = true

    // Carrega os totais do usuário para exibir no card principal da home.
    const loadUserStats = async () => {
      if (!user?.id) {
        if (isMounted) {
          setCategoriesCount(undefined)
          setWordsCount(undefined)
        }
        return
      }

      try {
        const userId = user.id
        const categories = await getCategoriesByUser(userId)

        const wordsByCategory = await Promise.all(
          categories.map((category) =>
            getWordsByCategory({ userId, categoryId: category.id })
          )
        )

        const totalWords = wordsByCategory.reduce(
          (accumulator, words) => accumulator + words.length,
          0
        )

        if (isMounted) {
          setCategoriesCount(categories.length)
          setWordsCount(totalWords)
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
        if (isMounted) {
          setCategoriesCount(undefined)
          setWordsCount(undefined)
        }
        toast.error("Não foi possível carregar os dados do perfil.")
      }
    }

    void loadUserStats()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  return (
    <div className="px-3 py-6 sm:p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 ml-5">Perfis de Usuários</h1>
      <Grid>
        {/* Hoje a aplicação mostra o usuário autenticado; a estrutura já permite evoluir para múltiplos perfis */}
        <Card
          user={user}
          categoriesCount={categoriesCount}
          wordsCount={wordsCount}
        />
      </Grid>
    </div>
  )
}
