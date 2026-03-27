import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Languages, PencilLine, Sparkles, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import CreateItemModal from "../components/CreateItemModal"
import LoadingScreen from "../components/LoadingScreen"
import TextCard from "../components/TextCard"
import { createManualText, deleteText, generateText, getTextsByUser, updateText } from "../service/textApi"
import type { TextEntry } from "../types/text"

type ModalType = "generate" | "manual" | "edit" | "delete" | null

const Texts = () => {
  const { userId } = useParams()
  const [texts, setTexts] = useState<TextEntry[]>([])
  const [modalType, setModalType] = useState<ModalType>(null)
  const [topic, setTopic] = useState("")
  const [manualEnglish, setManualEnglish] = useState("")
  const [manualPortuguese, setManualPortuguese] = useState("")
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [pendingDeleteText, setPendingDeleteText] = useState<TextEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Estamos processando seu texto")

  const hasTexts = texts.length > 0

  const pageSummary = useMemo(() => {
    if (!hasTexts) {
      return "Gere um texto curto com IA ou escreva um manualmente quando quiser continuar estudando sem OpenRouter."
    }

    return `${texts.length} texto${texts.length > 1 ? "s" : ""} disponivel${texts.length > 1 ? "eis" : ""} para leitura, traducao e audio.`
  }, [hasTexts, texts.length])

  const fetchTexts = async () => {
    if (!userId) {
      setTexts([])
      return
    }

    try {
      const data = await getTextsByUser(userId)
      setTexts(data)
    } catch (error) {
      console.error("Erro ao carregar textos:", error)
      toast.error("Nao foi possivel carregar os textos.")
    }
  }

  useEffect(() => {
    void fetchTexts()
  }, [userId])

  const resetModalState = () => {
    setTopic("")
    setManualEnglish("")
    setManualPortuguese("")
    setEditingTextId(null)
    setPendingDeleteText(null)
    setModalType(null)
  }

  const openEditModal = (text: TextEntry) => {
    setEditingTextId(text.id)
    setManualEnglish(text.english)
    setManualPortuguese(text.portuguese)
    setModalType("edit")
  }

  const openDeleteModal = (text: TextEntry) => {
    setPendingDeleteText(text)
    setModalType("delete")
  }

  const handleGenerateText = async () => {
    if (!userId) {
      toast.error("Usuario invalido.")
      return
    }

    if (!topic.trim()) {
      toast.warning("Informe um tema para gerar o texto.")
      return
    }

    setLoadingMessage("Estamos gerando seu texto com IA")
    setIsLoading(true)

    try {
      const response = await generateText({
        userId,
        topic: topic.trim(),
      })

      toast.success(response.detail ?? "Texto gerado com sucesso.")
      resetModalState()
      await fetchTexts()
    } catch (error) {
      console.error("Erro ao gerar texto:", error)
      toast.error("Nao foi possivel gerar o texto.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateManualText = async () => {
    if (!userId) {
      toast.error("Usuario invalido.")
      return
    }

    if (!manualEnglish.trim() || !manualPortuguese.trim()) {
      toast.warning("Preencha o texto em ingles e a traducao em portugues.")
      return
    }

    setLoadingMessage("Estamos criando seu texto manual")
    setIsLoading(true)

    try {
      const response = await createManualText({
        userId,
        english: manualEnglish.trim(),
        portuguese: manualPortuguese.trim(),
      })

      toast.success(response.detail ?? "Texto criado com sucesso.")
      resetModalState()
      await fetchTexts()
    } catch (error) {
      console.error("Erro ao criar texto manual:", error)
      toast.error("Nao foi possivel criar o texto manual.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateText = async () => {
    if (!userId || !editingTextId) {
      toast.error("Texto ou usuario invalido.")
      return
    }

    if (!manualEnglish.trim() || !manualPortuguese.trim()) {
      toast.warning("Preencha o texto em ingles e a traducao em portugues.")
      return
    }

    setLoadingMessage("Estamos atualizando seu texto")
    setIsLoading(true)

    try {
      const response = await updateText({
        textId: editingTextId,
        userId,
        english: manualEnglish.trim(),
        portuguese: manualPortuguese.trim(),
      })

      toast.success(response.detail ?? "Texto atualizado com sucesso.")
      resetModalState()
      await fetchTexts()
    } catch (error) {
      console.error("Erro ao atualizar texto:", error)
      toast.error("Nao foi possivel atualizar o texto.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteText = async () => {
    if (!userId || !pendingDeleteText) {
      toast.error("Texto ou usuario invalido.")
      return
    }

    setLoadingMessage("Estamos removendo seu texto")
    setIsLoading(true)

    try {
      const response = await deleteText({
        textId: pendingDeleteText.id,
        userId,
      })

      toast.success(response.detail ?? "Texto removido com sucesso.")
      resetModalState()
      await fetchTexts()
    } catch (error) {
      console.error("Erro ao excluir texto:", error)
      toast.error("Nao foi possivel excluir o texto.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6">
      <section className="overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-blue-900 text-white shadow-xl">
        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.35fr_0.95fr] md:px-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Texts</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
              Crie leituras curtas em ingles com traducao e audio.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              {pageSummary}
            </p>
          </div>

          <div className="grid gap-3 self-start rounded-[1.75rem] bg-white/8 p-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setModalType("generate")}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-slate-900 transition hover:scale-[1.01]"
            >
              <span>
                <span className="block text-sm font-semibold">Gerar com IA</span>
                <span className="block text-xs text-slate-500">OpenRouter cria o texto e a traducao</span>
              </span>
              <Sparkles size={18} />
            </button>

            <button
              type="button"
              onClick={() => setModalType("manual")}
              className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/15"
            >
              <span>
                <span className="block text-sm font-semibold">Criar manual</span>
                <span className="block text-xs text-blue-100">Use quando a IA nao estiver disponivel</span>
              </span>
              <PencilLine size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hasTexts ? (
          texts.map((text) => (
            <TextCard key={text.id} text={text} onDelete={() => openDeleteModal(text)} onEdit={openEditModal} />
          ))
        ) : (
          <div className="sm:col-span-2 xl:col-span-3 rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                <Languages size={24} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Nenhum texto criado ainda</h2>
              <p className="text-sm leading-6">
                Escolha um tema para a IA escrever um texto curto ou cadastre um texto manualmente com a traducao em portugues.
              </p>
            </div>
          </div>
        )}
      </section>

      <CreateItemModal
        title="Gerar texto com IA"
        isOpen={modalType === "generate"}
        onClose={resetModalState}
        onConfirm={handleGenerateText}
        confirmLabel="Gerar texto"
        isConfirmDisabled={!topic.trim()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="topic-input">
              Tema
            </label>
            <input
              id="topic-input"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Ex.: Daily routine, travel, work, family"
            />
          </div>
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            A IA vai gerar um texto curto em ingles, a traducao completa em portugues e o audio em ingles.
          </p>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Criar texto manual"
        isOpen={modalType === "manual"}
        onClose={resetModalState}
        onConfirm={handleCreateManualText}
        confirmLabel="Salvar texto"
        isConfirmDisabled={!manualEnglish.trim() || !manualPortuguese.trim()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="manual-english-input">
              Texto em ingles
            </label>
            <textarea
              id="manual-english-input"
              value={manualEnglish}
              onChange={(event) => setManualEnglish(event.target.value)}
              className="min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Write a short English text here."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="manual-portuguese-input">
              Traducao em portugues
            </label>
            <textarea
              id="manual-portuguese-input"
              value={manualPortuguese}
              onChange={(event) => setManualPortuguese(event.target.value)}
              className="min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Escreva aqui a traducao completa em portugues."
            />
          </div>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Editar texto"
        isOpen={modalType === "edit"}
        onClose={resetModalState}
        onConfirm={handleUpdateText}
        confirmLabel="Salvar alteracoes"
        isConfirmDisabled={!manualEnglish.trim() || !manualPortuguese.trim()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="edit-english-input">
              Texto em ingles
            </label>
            <textarea
              id="edit-english-input"
              value={manualEnglish}
              onChange={(event) => setManualEnglish(event.target.value)}
              className="min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Write a short English text here."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="edit-portuguese-input">
              Traducao em portugues
            </label>
            <textarea
              id="edit-portuguese-input"
              value={manualPortuguese}
              onChange={(event) => setManualPortuguese(event.target.value)}
              className="min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Escreva aqui a traducao completa em portugues."
            />
          </div>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Excluir texto"
        isOpen={modalType === "delete"}
        onClose={resetModalState}
        onConfirm={handleDeleteText}
        confirmLabel="Excluir texto"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
            <Trash2 size={20} className="mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold">Esta acao nao pode ser desfeita.</p>
              <p className="text-sm leading-6 text-red-700/90">
                O texto e o audio em ingles associados serao removidos da sua lista.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-900">Texto selecionado</p>
            <p className="mt-2 line-clamp-5 whitespace-pre-line">{pendingDeleteText?.english ?? ""}</p>
          </div>
        </div>
      </CreateItemModal>

      {isLoading && <LoadingScreen title="Aguarde" content={loadingMessage} />}
    </div>
  )
}

export default Texts
