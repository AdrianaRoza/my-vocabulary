import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia"
import { CiEdit } from "react-icons/ci"
import { MdDeleteOutline } from "react-icons/md"
import { PiSpeakerHigh } from "react-icons/pi"
import type { Phrase } from "../types/phrase"
import type { Word } from "../types/word"

interface CardProps {
  word: Word
  userId: string
  categoryId: string
  onWordUpdated: (wordId: string, english: string) => Promise<void>
  onWordDeleted: (wordId: string) => Promise<void>
}

const CardFlip = ({ word, userId, categoryId, onWordUpdated, onWordDeleted }: CardProps) => {
  const [flipped, setFlipped] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [editedWord, setEditedWord] = useState(word)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setEditedWord(word)
  }, [word])

  const playAudio = (e: React.MouseEvent<HTMLElement>, url?: string | null) => {
    e.stopPropagation()

    if (!url) {
      toast.warning("Audio indisponível para este item.")
      return
    }

    void new Audio(url).play().catch(() => {
      toast.error("Não foi possível reproduzir o áudio.")
    })
  }

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!userId || !categoryId) {
      toast.error("Usuário ou categoria inválidos.")
      return
    }

    const newEnglish = window.prompt("Editar inglês:", editedWord.english)?.trim()

    if (!newEnglish) return
    if (newEnglish === editedWord.english) return

    setIsSubmitting(true)
    try {
      await onWordUpdated(editedWord.id, newEnglish)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!userId) {
      toast.error("Usuário inválido.")
      return
    }

    const confirmDelete = window.confirm(`Deseja excluir a palavra "${editedWord.english}"?`)
    if (!confirmDelete) return

    setIsSubmitting(true)
    try {
      await onWordDeleted(editedWord.id)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTranslate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowTranslation((current) => !current)
  }

  return (
    <div
      className="w-full aspect-5/8 perspective"
      onClick={() => setFlipped((current) => !current)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg bg-gray-200">
          {editedWord.imageUrl ? (
            <img
              src={editedWord.imageUrl}
              alt={editedWord.english}
              className="w-full h-full object-cover transition duration-700 ease-in-out hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-l from-gray-900 to-blue-800 text-white p-6 text-center font-semibold">
              {editedWord.english}
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-2 flex justify-around bg-black/20">
            <button
              onClick={(e) => playAudio(e, editedWord.audioUrl)}
              className="px-4 py-2 hover:bg-gray-500 text-sm rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              <PiSpeakerHigh className="text-amber-50" />
            </button>
          </div>
        </div>

        <div
          className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gray-900 text-white p-3 sm:p-4 flex flex-col items-center text-center shadow-lg overflow-hidden"
          onMouseEnter={(e) => {
            e.stopPropagation()
          }}
          onMouseLeave={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="w-full px-1">
            <p className="mt-5 text-[clamp(0.85rem,2.3vw,1.125rem)] font-semibold leading-tight break-words">
              {showTranslation ? editedWord.portuguese : editedWord.english}
            </p>
          </div>

          <div className="mt-3 mb-12 w-full flex-1 overflow-y-auto px-1 lg:px-3 flex flex-col items-center justify-center">
            {editedWord.phrases.length > 0 ? (
              editedWord.phrases.map((phrase: Phrase) => (
                <div
                  key={phrase.id}
                  onClick={(e) => playAudio(e, phrase.audioUrl)}
                  className="text-[clamp(0.62rem,1.7vw,0.72rem)] my-1.5 hover:cursor-pointer break-words text-center max-w-[95%] lg:max-w-[88%] leading-tight"
                >
                  <div>{showTranslation ? phrase.translation : phrase.text}</div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-300">Nenhuma frase disponível.</p>
            )}
          </div>

          <div className="absolute bottom-0 left-0 w-full flex justify-around items-center p-3">
            <button
              onClick={handleEdit}
              disabled={isSubmitting}
              className="px-4 py-2 hover:bg-gray-700 text-sm rounded disabled:opacity-50"
            >
              <CiEdit />
            </button>

            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2 hover:bg-gray-700 text-sm rounded disabled:opacity-50"
            >
              <MdDeleteOutline />
            </button>

            <button
              onClick={handleTranslate}
              disabled={isSubmitting}
              className="px-4 py-2 hover:bg-gray-700 text-sm rounded disabled:opacity-50"
            >
              {showTranslation ? <LiaEyeSolid /> : <LiaEyeSlashSolid />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardFlip
