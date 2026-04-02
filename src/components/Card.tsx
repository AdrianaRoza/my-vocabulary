import { Link } from "react-router-dom"
import { BookOpen, FolderKanban } from "lucide-react"
import type { User } from "../types/user"

interface CardProps {
  user: User | null
  categoriesCount?: number
  wordsCount?: number
}

const Card = ({ user, categoriesCount, wordsCount }: CardProps) => {
  if (!user?.id) return null
  const resolvedCategoriesCount = categoriesCount ?? user.categoriesCount
  const resolvedWordsCount = wordsCount ?? user.wordsCount

  // Usa a inicial do nome como avatar simples do card.
  const initial = user.name?.trim().charAt(0).toUpperCase() || "U"

  return (
    <div
      className="rounded-2xl 
        w-full aspect-5/8 md:max-w-[10.5rem] lg:max-w-[11rem] xl:max-w-[11.25rem] 2xl:max-w-[11.5rem] mx-auto
        bg-linear-to-l from-gray-900 to-blue-800
        text-white shadow-lg p-3 sm:p-4 overflow-hidden
        flex flex-col justify-between sm:justify-start
        hover:scale-105 hover:shadow-2xl transition"
    >
      {/* Cabeçalho clicável que leva para a página de perfil */}
      <Link
        to={`/profile/${user.id}`}
        className="flex items-center gap-2 sm:gap-3 min-w-0 rounded-xl transition hover:bg-white/5 p-1 -m-1 overflow-hidden"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center font-semibold shrink-0">
          {initial}
        </div>

        <div className="min-w-0">
          <p className="max-w-[95%] font-semibold leading-tight break-normal text-[clamp(0.42rem,1.45vw,0.95rem)]">
            {user.name}
          </p>
        </div>
      </Link>

      {/* Métricas clicáveis para acessar categorias e palavras do usuário */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-1.5 sm:gap-2 text-[clamp(0.48rem,1.15vw,0.72rem)] sm:my-auto">
        <Link
          to={`/profile/${user.id}/categories`}
          className="bg-white/10 rounded-lg p-1.5 sm:p-2 border border-white/20 min-w-0 overflow-hidden transition hover:bg-white/15 flex flex-col items-center justify-center text-center"
        >
          <p className="flex items-center justify-center gap-1 text-blue-100 whitespace-nowrap text-[clamp(0.44rem,1vw,0.7rem)] leading-tight">
            <FolderKanban size={9} />
            Categorias
          </p>
          <p className="mt-1 font-semibold whitespace-nowrap text-[clamp(0.62rem,1.4vw,0.95rem)] leading-none">
            {resolvedCategoriesCount ?? "-"}
          </p>
        </Link>
        <Link
          to={`/profile/${user.id}/words`}
          className="bg-white/10 rounded-lg p-1.5 sm:p-2 border border-white/20 min-w-0 overflow-hidden transition hover:bg-white/15 flex flex-col items-center justify-center text-center"
        >
          <p className="flex items-center justify-center gap-1 text-blue-100 whitespace-nowrap text-[clamp(0.44rem,1vw,0.7rem)] leading-tight">
            <BookOpen size={9} />
            Palavras
          </p>
          <p className="mt-1 font-semibold whitespace-nowrap text-[clamp(0.62rem,1.4vw,0.95rem)] leading-none">
            {resolvedWordsCount ?? "-"}
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Card
