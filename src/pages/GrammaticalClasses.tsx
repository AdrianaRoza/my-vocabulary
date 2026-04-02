import { BookText } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Grid from "../components/Grid"
import LoadingScreen from "../components/LoadingScreen"
import { getGrammarClassesByUser } from "../service/grammarClassApi"
import type { GrammarClassSummary } from "../types/grammarClass"

const GrammaticalClasses = () => {
  const { userId } = useParams()
  const [grammarClasses, setGrammarClasses] = useState<GrammarClassSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const activeClassesCount = useMemo(
    () => grammarClasses.filter((item) => (item.wordsCount ?? 0) > 0).length,
    [grammarClasses]
  )

  useEffect(() => {
    let isMounted = true

    const loadGrammarClasses = async () => {
      if (!userId) {
        if (isMounted) setGrammarClasses([])
        return
      }

      try {
        setIsLoading(true)
        const data = await getGrammarClassesByUser(userId)
        if (isMounted) setGrammarClasses(data)
      } catch (error) {
        console.error("Erro ao carregar classes gramaticais:", error)
        if (isMounted) setGrammarClasses([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadGrammarClasses()

    return () => {
      isMounted = false
    }
  }, [userId])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6">
      {isLoading && (
        <LoadingScreen
          title="Quase lá..."
          content="Estamos carregando as classes gramaticais."
        />
      )}

      <section className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-blue-900 text-white shadow-xl">
        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.35fr_0.95fr] md:px-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Grammar Classes</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Organize o estudo por classes gramaticais.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              Esta área vai concentrar conteúdos como substantivos, verbos, adjetivos e outros grupos gramaticais do perfil selecionado.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[1.75rem] bg-white/8 p-5 backdrop-blur-sm">
            <span>
              <span className="block text-xs uppercase tracking-[0.22em] text-blue-200">Classes ativas</span>
              <span className="mt-1 block text-lg font-semibold text-white">{activeClassesCount}</span>
            </span>
            <BookText className="h-6 w-6 text-blue-200" />
          </div>
        </div>
      </section>

      <Grid>
        {grammarClasses.map((grammarClass) => (
          <Link
            key={grammarClass.slug}
            to={`/profile/${userId}/grammar-classes/${grammarClass.slug}`}
            className="mx-auto flex aspect-5/8 w-full md:max-w-[10.5rem] lg:max-w-[11rem] xl:max-w-[11.25rem] 2xl:max-w-[11.5rem] items-center justify-center rounded-2xl bg-linear-to-r from-gray-900 to-blue-800 px-3 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-3 text-center">
              <span className="max-w-[88%] text-center text-[clamp(0.62rem,1.7vw,1rem)] leading-tight break-normal">
                {grammarClass.name}
              </span>
              <span className="text-xs text-blue-100">
                {(grammarClass.wordsCount ?? 0).toString()} palavra{grammarClass.wordsCount === 1 ? "" : "s"}
              </span>
            </div>
          </Link>
        ))}
      </Grid>
    </div>
  )
}

export default GrammaticalClasses
