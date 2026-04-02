import { BookText } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CardFlip from "../components/CardFlip"
import Grid from "../components/Grid"
import LoadingScreen from "../components/LoadingScreen"
import { getWordsByGrammarClass } from "../service/grammarClassApi"
import { getGrammarClassLabel } from "./grammarClassesData"
import type { Word } from "../types/word"

const GrammaticalClassDetail = () => {
  const { classSlug, userId } = useParams()
  const classLabel = getGrammarClassLabel(classSlug)
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadWords = async () => {
      if (!userId || !classSlug) {
        if (isMounted) setWords([])
        return
      }

      try {
        setIsLoading(true)
        const data = await getWordsByGrammarClass(userId, classSlug)
        if (isMounted) setWords(data)
      } catch (error) {
        console.error("Erro ao carregar palavras da classe gramatical:", error)
        if (isMounted) setWords([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadWords()

    return () => {
      isMounted = false
    }
  }, [classSlug, userId])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6">
      {isLoading && (
        <LoadingScreen
          title="Quase lá..."
          content="Estamos carregando as palavras desta classe gramatical."
        />
      )}

      <section className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-blue-900 text-white shadow-xl">
        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.35fr_0.95fr] md:px-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Grammar Class</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              {classLabel}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              Esta página está pronta para receber o conteúdo específico desta classe gramatical.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[1.75rem] bg-white/8 p-5 backdrop-blur-sm">
            <span>
              <span className="block text-xs uppercase tracking-[0.22em] text-blue-200">Palavras vinculadas</span>
              <span className="mt-1 block text-lg font-semibold text-white">{words.length}</span>
            </span>
            <BookText className="h-6 w-6 text-blue-200" />
          </div>
        </div>
      </section>

      {words.length > 0 ? (
        <Grid>
          {words.map((word) => (
            <CardFlip key={word.id} word={word} />
          ))}
        </Grid>
      ) : (
        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 text-blue-700">
              <BookText size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Nenhuma palavra vinculada ainda</h2>
            <p className="text-sm leading-6">
              Vincule palavras a esta classe gramatical a partir da tela de categoria ao criar ou editar uma palavra.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default GrammaticalClassDetail
