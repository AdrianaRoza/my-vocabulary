import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowRight, Layers3 } from "lucide-react"
import { toast } from "react-toastify"
import CardFlip from "../components/CardFlip"
import Grid from "../components/Grid"
import type { Word } from "../types/word"
import { getCategoriesByUser } from "../service/categoryApi"
import { getWordsByCategory } from "../service/wordApi"

const Words = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [words, setWords] = useState<Word[]>([])
  const hasWords = words.length > 0

  const pageSummary = useMemo(() => {
    if (!hasWords) {
      return "Veja todas as palavras do perfil em um unico lugar e volte para as categorias quando quiser criar ou organizar novos termos."
    }

    return `${words.length} palavra${words.length > 1 ? "s" : ""} reunida${words.length > 1 ? "s" : ""} de todas as categorias deste perfil.`
  }, [hasWords, words.length])

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6">
      <section className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-blue-900 text-white shadow-xl">
        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.35fr_0.95fr] md:px-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Words</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Consulte todas as palavras do perfil em um unico painel.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              {pageSummary}
            </p>
          </div>

          <div className="grid gap-3 self-start rounded-[1.75rem] bg-white/8 p-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => navigate(`/profile/${userId}/categories`)}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-slate-900 transition hover:scale-[1.01]"
            >
              <span>
                <span className="block text-sm font-semibold">Abrir categorias</span>
                <span className="block text-xs text-slate-500">Gerencie onde cada palavra fica organizada</span>
              </span>
              <ArrowRight className="h-5 w-5 text-blue-700" />
            </button>

            <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/30 px-4 py-3">
              <span>
                <span className="block text-xs uppercase tracking-[0.22em] text-blue-200">Total atual</span>
                <span className="block text-lg font-semibold text-white">{words.length}</span>
              </span>
              <Layers3 className="h-5 w-5 text-blue-200" />
            </div>
          </div>
        </div>
      </section>

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
