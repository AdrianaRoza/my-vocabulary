import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import CardFlip from "../components/CardFlip"
import Grid from "../components/Grid"
import type { Word } from "../types/word"
import { getCategoriesByUser } from "../service/categoryApi"
import { getWordsByCategory } from "../service/wordApi"

const Words = () => {
  const { userId } = useParams()
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    let isMounted = true

    // Agrega as palavras de todas as categorias do usuário.
    const loadWords = async () => {
      if (!userId) return

      try {
        const categories = await getCategoriesByUser(userId)
        const wordsByCategory = await Promise.all(
          categories.map((category) =>
            getWordsByCategory({ userId, categoryId: category.id })
          )
        )

        const allWords = wordsByCategory.flat()

        if (isMounted) {
          setWords(allWords)
        }
      } catch (error) {
        console.error("Erro ao carregar palavras do usuário:", error)
        toast.error("Não foi possível carregar as palavras.")
      }
    }

    void loadWords()

    return () => {
      isMounted = false
    }
  }, [userId])

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Palavras</h1>

      {/* Grid com todas as palavras encontradas para o usuário */}
      <Grid>
        {words.map((word) => (
          <CardFlip key={word.id} word={word} />
        ))}
      </Grid>

      {/* Estado vazio para quando ainda não existir nenhuma palavra */}
      {words.length === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Nenhuma palavra encontrada para este usuário.
        </div>
      )}
    </div>
  )
}

export default Words
