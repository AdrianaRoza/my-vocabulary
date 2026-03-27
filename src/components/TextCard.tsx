import { Eye, EyeOff, Pencil, Trash2, Volume2 } from "lucide-react"
import { useMemo, useState } from "react"
import type { TextEntry } from "../types/text"

type TextCardProps = {
  text: TextEntry
  onDelete: (textId: string) => void
  onEdit: (text: TextEntry) => void
}

const MAX_TITLE_LENGTH = 42

const buildCardTitle = (englishText: string) => {
  const normalized = englishText.replace(/\s+/g, " ").trim()
  if (!normalized) {
    return "Reading Practice"
  }

  const firstSentence = normalized.split(/[.!?]/)[0]?.trim() || normalized
  if (firstSentence.length <= MAX_TITLE_LENGTH) {
    return firstSentence
  }

  return `${firstSentence.slice(0, MAX_TITLE_LENGTH).trimEnd()}...`
}

const TextCard = ({ text, onDelete, onEdit }: TextCardProps) => {
  const [isTranslationVisible, setIsTranslationVisible] = useState(false)
  const cardTitle = useMemo(() => buildCardTitle(text.english), [text.english])

  const handlePlayAudio = async () => {
    if (!text.audioUrl) {
      return
    }

    try {
      const audio = new Audio(text.audioUrl)
      await audio.play()
    } catch (error) {
      console.error("Erro ao reproduzir audio do texto:", error)
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-linear-to-r from-slate-900 to-blue-800 px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100">English Text</p>
            <h3 className="mt-1 text-lg font-semibold leading-tight">{cardTitle}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(text)}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Editar texto"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(text.id)}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Excluir texto"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">Ingles</p>
            <button
              type="button"
              onClick={handlePlayAudio}
              disabled={!text.audioUrl}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Volume2 size={16} />
              Audio
            </button>
          </div>
          <p className="whitespace-pre-line leading-7 text-slate-900">{text.english}</p>
        </section>

        <section className="space-y-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">Traducao</p>
            <button
              type="button"
              onClick={() => setIsTranslationVisible((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              {isTranslationVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {isTranslationVisible ? "Ocultar" : "Exibir"}
            </button>
          </div>

          {isTranslationVisible ? (
            <p className="whitespace-pre-line leading-7 text-slate-700">{text.portuguese}</p>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-sm text-slate-500">
              Clique no olho para exibir a traducao em portugues.
            </div>
          )}
        </section>
      </div>
    </article>
  )
}

export default TextCard
