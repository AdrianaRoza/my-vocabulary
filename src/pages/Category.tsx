import { useEffect, useMemo, useState } from "react"
import { FileJson2, Files, Layers3, PlusCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import CardFlip from "../components/CardFlip"
import CreateItemModal from "../components/CreateItemModal"
import Grid from "../components/Grid"
import LoadingScreen from "../components/LoadingScreen"
import { getCategoriesByUser } from "../service/categoryApi"
import { getGrammarClassesByUser } from "../service/grammarClassApi"
import {
  createWord,
  deleteWord,
  getWordsByCategory,
  importWords,
  importWordsFromFile,
  updateWord,
  type ImportMode,
  type WordImportItem,
} from "../service/wordApi"
import type { GrammarClassSummary } from "../types/grammarClass"
import type { Word } from "../types/word"

type ModalType = "create" | "edit" | "delete" | "importJson" | "importFile" | null
type GrammarSelectionMode = "manual" | "ai"

type ImportPayloadLike = {
  items?: WordImportItem[]
  english?: string
  portuguese?: string
  sentences?: Array<{
    english: string
    portuguese: string
  }>
}

const IMPORT_MODE_OPTIONS: ImportMode[] = ["skip", "update", "error"]
const IMPORT_JSON_EXAMPLE = `{
  "items": [
    {
      "english": "Notebook",
      "portuguese": "Caderno",
      "sentences": [
        {
          "english": "This notebook is blue.",
          "portuguese": "Este caderno e azul."
        }
      ]
    }
  ]
}`

const formatImportSummary = (result: {
  total: number
  created: number
  linked: number
  updated: number
  skipped: number
  failed: number
}) => {
  return [
    `total: ${result.total}`,
    `created: ${result.created}`,
    `linked: ${result.linked}`,
    `updated: ${result.updated}`,
    `skipped: ${result.skipped}`,
    `failed: ${result.failed}`,
  ].join(" | ")
}

const normalizeImportItems = (parsed: unknown): WordImportItem[] => {
  if (Array.isArray(parsed)) {
    return parsed as WordImportItem[]
  }

  if (parsed && typeof parsed === "object") {
    const candidate = parsed as ImportPayloadLike

    if (Array.isArray(candidate.items)) {
      return candidate.items
    }

    if (candidate.english && candidate.portuguese) {
      return [
        {
          english: candidate.english,
          portuguese: candidate.portuguese,
          sentences: candidate.sentences,
        },
      ]
    }
  }

  throw new Error("JSON inválido. Envie um array de items, um objeto com items, ou um único item.")
}

const Category = () => {
  const { categoryId, userId } = useParams()
  const [words, setWords] = useState<Word[]>([])
  const [categoryTitle, setCategoryTitle] = useState("Categoria")
  const [newWord, setNewWord] = useState("")
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [editingWordName, setEditingWordName] = useState("")
  const [pendingDeleteWord, setPendingDeleteWord] = useState<Word | null>(null)
  const [grammarClasses, setGrammarClasses] = useState<GrammarClassSummary[]>([])
  const [selectedGrammarClassSlugs, setSelectedGrammarClassSlugs] = useState<string[]>([])
  const [grammarSelectionMode, setGrammarSelectionMode] = useState<GrammarSelectionMode>("manual")
  const [modalType, setModalType] = useState<ModalType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Estamos processando sua solicitação")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [importJsonText, setImportJsonText] = useState("")
  const [importMode, setImportMode] = useState<ImportMode>("skip")
  const [importFile, setImportFile] = useState<File | null>(null)
  const hasWords = words.length > 0

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
    if (!hasWords) {
      return "Adicione palavras manualmente ou importe um conjunto pronto para preencher esta categoria."
    }

    return `${words.length} palavra${words.length > 1 ? "s" : ""} cadastrada${words.length > 1 ? "s" : ""} dentro da categoria ${categoryTitle}.`
  }, [categoryTitle, hasWords, words.length])

  const importAiPrompt = `Generate a valid JSON payload for a vocabulary import API.

Rules:
- Return only JSON.
- Use this exact shape:
{
  "items": [
    {
      "english": "Word in English",
      "portuguese": "Translation in Portuguese",
      "sentences": [
        {
          "english": "A simple sentence in English.",
          "portuguese": "A traducao da frase em portugues."
        }
      ]
    }
  ]
}
- Do not include markdown fences.
- Do not include explanations.
- Generate beginner-friendly vocabulary and short sentences.
- Category context: ${categoryTitle}.`

  const handleCopyText = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(successMessage)
    } catch (error) {
      toast.error("Nao foi possivel copiar o texto.")
      console.error("Erro ao copiar texto:", error)
    }
  }

  // Atualiza a lista de palavras da categoria aberta.
  const fetchWords = async () => {
    if (!userId || !categoryId) return

    try {
      const data = await getWordsByCategory({ userId, categoryId })
      setWords(data)
    } catch (error) {
      console.error("Erro ao buscar palavras:", error)
      toast.error("Não foi possível carregar as palavras.")
    }
  }

  const fetchCategoryTitle = async () => {
    if (!userId || !categoryId) return

    try {
      const categories = await getCategoriesByUser(userId)
      const currentCategory = categories.find((category) => category.id === categoryId)
      setCategoryTitle(currentCategory?.name || "Categoria")
    } catch (error) {
      console.error("Erro ao carregar título da categoria:", error)
      setCategoryTitle("Categoria")
    }
  }

  useEffect(() => {
    void fetchWords()
  }, [categoryId, userId])

  useEffect(() => {
    let isMounted = true

    const loadGrammarClasses = async () => {
      if (!userId) {
        if (isMounted) setGrammarClasses([])
        return
      }

      try {
        const data = await getGrammarClassesByUser(userId)
        if (isMounted) setGrammarClasses(data)
      } catch (error) {
        console.error("Erro ao carregar classes gramaticais:", error)
        if (isMounted) setGrammarClasses([])
      }
    }

    void loadGrammarClasses()

    return () => {
      isMounted = false
    }
  }, [userId])

  // Descobre o nome da categoria atual para exibir no título da página.
  useEffect(() => {
    void fetchCategoryTitle()
  }, [categoryId, userId])

  const addNewWord = async () => {
    if (!newWord.trim()) {
      toast.warning("O campo não pode ser vazio.")
      return
    }

    if (!userId || !categoryId) {
      toast.error("Categoria ou usuário inválido.")
      return
    }

    try {
      setModalType(null)
      setLoadingMessage("Estamos criando sua nova palavra")
      setIsLoading(true)

      const response = await createWord({
        english: newWord.trim(),
        userId,
        categoryId,
        grammarClassSlugs: selectedGrammarClassSlugs,
        useAiGrammarClassification: grammarSelectionMode === "ai",
      })

      setNewWord("")
      setSelectedGrammarClassSlugs([])
      setGrammarSelectionMode("manual")
      await fetchWords()
      showTimedScreen("success", response.detail ?? "Sua palavra foi criada com sucesso.")
    } catch (error) {
      console.error("Erro ao criar palavra:", error)
      showTimedScreen("error", "Não foi possível criar a palavra.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWordUpdated = (word: Word) => {
    setEditingWord(word)
    setEditingWordName(word.english)
    setSelectedGrammarClassSlugs(word.grammarClasses?.map((item) => item.slug) ?? [])
    setGrammarSelectionMode("manual")
    setModalType("edit")
  }

  const handleWordDeleted = (word: Word) => {
    setPendingDeleteWord(word)
    setModalType("delete")
  }

  const confirmWordUpdated = async () => {
    if (!userId || !categoryId || !editingWord) {
      toast.error("Categoria ou usuário inválidos.")
      return
    }

    const nextEnglish = editingWordName.trim()
    if (!nextEnglish || nextEnglish === editingWord.english) {
      setEditingWord(null)
      setEditingWordName("")
      setSelectedGrammarClassSlugs([])
      setGrammarSelectionMode("manual")
      setModalType(null)
      return
    }

    const word = editingWord
    setEditingWord(null)
    setEditingWordName("")
    setSelectedGrammarClassSlugs([])
    setGrammarSelectionMode("manual")
    setModalType(null)
    setLoadingMessage("Estamos atualizando sua palavra")
    setIsLoading(true)

    try {
      const response = await updateWord({
        wordId: word.id,
        english: nextEnglish,
        userId,
        categoryId,
        grammarClassSlugs: selectedGrammarClassSlugs,
        useAiGrammarClassification: grammarSelectionMode === "ai",
      })

      await fetchWords()
      showTimedScreen("success", response.detail ?? "Sua palavra foi atualizada com sucesso.")
    } catch (error) {
      console.error("Erro ao atualizar palavra:", error)
      showTimedScreen("error", "Não foi possível atualizar a palavra.")
    } finally {
      setIsLoading(false)
    }
  }

  const confirmWordDeleted = async () => {
    if (!userId || !pendingDeleteWord) {
      toast.error("Usuário inválido.")
      return
    }

    const word = pendingDeleteWord
    setPendingDeleteWord(null)
    setModalType(null)
    setLoadingMessage("Estamos removendo sua palavra")
    setIsLoading(true)

    try {
      const response = await deleteWord({
        wordId: word.id,
        userId,
      })

      await fetchWords()
      showTimedScreen("success", response.detail ?? "Sua palavra foi removida com sucesso.")
    } catch (error) {
      console.error("Erro ao excluir palavra:", error)
      showTimedScreen("error", "Não foi possível excluir a palavra.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportJson = async () => {
    if (!userId || !categoryId) {
      toast.error("Categoria ou usuário inválido.")
      return
    }

    if (!importJsonText.trim()) {
      toast.warning("Cole um JSON válido para importar.")
      return
    }

    setLoadingMessage("Estamos importando suas palavras via JSON")
    setIsLoading(true)

    try {
      const parsed = JSON.parse(importJsonText)
      const items = normalizeImportItems(parsed)
      const result = await importWords({
        userId,
        categoryId,
        items,
        mode: importMode,
      })

      showTimedScreen("success", `Importação concluída: ${formatImportSummary(result)}`)
      if (result.errors.length > 0) {
        toast.warning(`Alguns itens falharam: ${result.errors[0].reason}`)
      }
      setImportJsonText("")
      setModalType(null)
      await fetchWords()
    } catch (error) {
      console.error("Erro ao importar JSON:", error)
      showTimedScreen("error", "Não foi possível importar o JSON.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportFile = async () => {
    if (!userId || !categoryId) {
      toast.error("Categoria ou usuário inválido.")
      return
    }

    if (!importFile) {
      toast.warning("Selecione um arquivo para importar.")
      return
    }

    setLoadingMessage("Estamos importando seu arquivo")
    setIsLoading(true)

    try {
      const result = await importWordsFromFile({
        file: importFile,
        userId,
        categoryId,
        mode: importMode,
      })

      showTimedScreen("success", `Importação concluída: ${formatImportSummary(result)}`)
      if (result.errors.length > 0) {
        toast.warning(`Alguns itens falharam: ${result.errors[0].reason}`)
      }
      setImportFile(null)
      setModalType(null)
      await fetchWords()
    } catch (error) {
      console.error("Erro ao importar arquivo:", error)
      showTimedScreen("error", "Não foi possível importar o arquivo.")
    } finally {
      setIsLoading(false)
    }
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
            <p className="text-sm uppercase tracking-[0.28em] text-blue-200">Category</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">{categoryTitle}</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
              {pageSummary}
            </p>
          </div>

          <div className="grid gap-3 self-start rounded-[1.75rem] bg-white/8 p-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setModalType("create")}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-slate-900 transition hover:scale-[1.01]"
            >
              <span>
                <span className="block text-sm font-semibold">Adicionar palavra</span>
                <span className="block text-xs text-slate-500">Inclua um novo termo nesta categoria</span>
              </span>
              <PlusCircle className="h-5 w-5 text-blue-700" />
            </button>

            <button
              type="button"
              onClick={() => setModalType("importJson")}
              className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/30 px-4 py-3 text-left transition hover:border-white/25"
            >
              <span>
                <span className="block text-sm font-semibold text-white">Importar JSON</span>
                <span className="block text-xs text-slate-300">Cole uma estrutura pronta para importar</span>
              </span>
              <FileJson2 className="h-5 w-5 text-blue-200" />
            </button>

            <button
              type="button"
              onClick={() => setModalType("importFile")}
              className="flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/30 px-4 py-3 text-left transition hover:border-white/25"
            >
              <span>
                <span className="block text-sm font-semibold text-white">Importar arquivo</span>
                <span className="block text-xs text-slate-300">Envie um arquivo `.json`, `.md` ou `.markdown`</span>
              </span>
              <Files className="h-5 w-5 text-blue-200" />
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
          <CardFlip
            key={word.id}
            word={word}
            userId={userId ?? ""}
            categoryId={categoryId ?? ""}
            onWordUpdated={handleWordUpdated}
            onWordDeleted={handleWordDeleted}
          />
        ))}
      </Grid>

      {!isLoading && words.length === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Nenhuma palavra encontrada para esta categoria.
        </div>
      )}

      <CreateItemModal
        title="Nova Palavra"
        isOpen={modalType === "create"}
        onConfirm={addNewWord}
        onClose={() => {
          setNewWord("")
          setSelectedGrammarClassSlugs([])
          setGrammarSelectionMode("manual")
          setModalType(null)
        }}
        confirmLabel="Adicionar palavra"
        isConfirmDisabled={!newWord.trim()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Palavra em ingles</label>
            <input
              value={newWord}
              onChange={(event) => setNewWord(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Digite a palavra"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Definição da classe gramatical</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setGrammarSelectionMode("manual")}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  grammarSelectionMode === "manual"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span className="block font-medium">Escolher manualmente</span>
                <span className="mt-1 block text-xs opacity-80">Você marca uma ou mais classes.</span>
              </button>

              <button
                type="button"
                onClick={() => setGrammarSelectionMode("ai")}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  grammarSelectionMode === "ai"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span className="block font-medium">Deixar a IA decidir</span>
                <span className="mt-1 block text-xs opacity-80">A IA escolhe uma classe para a palavra.</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Classes gramaticais</p>
            {grammarSelectionMode === "manual" ? (
              <div className="grid gap-2 sm:grid-cols-2">
              {grammarClasses.map((grammarClass) => {
                const checked = selectedGrammarClassSlugs.includes(grammarClass.slug)

                return (
                  <label
                    key={grammarClass.slug}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                      checked
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedGrammarClassSlugs((current) =>
                          checked
                            ? current.filter((slug) => slug !== grammarClass.slug)
                            : [...current, grammarClass.slug]
                        )
                      }
                    />
                    <span>{grammarClass.name}</span>
                  </label>
                )
              })}
              </div>
            ) : (
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                Ao salvar, a IA vai escolher automaticamente a classe gramatical mais adequada.
              </p>
            )}
          </div>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Editar palavra"
        isOpen={modalType === "edit"}
        onConfirm={confirmWordUpdated}
        onClose={() => {
          setEditingWord(null)
          setEditingWordName("")
          setSelectedGrammarClassSlugs([])
          setGrammarSelectionMode("manual")
          setModalType(null)
        }}
        confirmLabel="Salvar alteracoes"
        isConfirmDisabled={!editingWordName.trim()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Palavra em ingles</label>
            <input
              value={editingWordName}
              onChange={(event) => setEditingWordName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Digite a palavra em ingles"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Definição da classe gramatical</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setGrammarSelectionMode("manual")}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  grammarSelectionMode === "manual"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span className="block font-medium">Escolher manualmente</span>
                <span className="mt-1 block text-xs opacity-80">Você ajusta as classes desta palavra.</span>
              </button>

              <button
                type="button"
                onClick={() => setGrammarSelectionMode("ai")}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  grammarSelectionMode === "ai"
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                <span className="block font-medium">Recalcular com IA</span>
                <span className="mt-1 block text-xs opacity-80">A IA substitui a classe atual por uma sugestão.</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Classes gramaticais</p>
            {grammarSelectionMode === "manual" ? (
              <div className="grid gap-2 sm:grid-cols-2">
              {grammarClasses.map((grammarClass) => {
                const checked = selectedGrammarClassSlugs.includes(grammarClass.slug)

                return (
                  <label
                    key={grammarClass.slug}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                      checked
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedGrammarClassSlugs((current) =>
                          checked
                            ? current.filter((slug) => slug !== grammarClass.slug)
                            : [...current, grammarClass.slug]
                        )
                      }
                    />
                    <span>{grammarClass.name}</span>
                  </label>
                )
              })}
              </div>
            ) : (
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                Ao salvar, a IA vai recalcular automaticamente a classe gramatical desta palavra.
              </p>
            )}
          </div>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Excluir palavra"
        isOpen={modalType === "delete"}
        onConfirm={confirmWordDeleted}
        onClose={() => {
          setPendingDeleteWord(null)
          setModalType(null)
        }}
        confirmLabel="Excluir palavra"
      >
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            Tem certeza de que deseja excluir a palavra{" "}
            <span className="font-semibold text-slate-900">{pendingDeleteWord?.english}</span>?
          </p>
          <p>Essa ação remove a palavra desta categoria para o usuário atual.</p>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Importar Palavras via JSON"
        isOpen={modalType === "importJson"}
        onConfirm={handleImportJson}
        onClose={() => setModalType(null)}
        confirmLabel="Importar JSON"
        isConfirmDisabled={!importJsonText.trim()}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-gray-700">Exemplo de JSON</label>
              <button
                type="button"
                onClick={() => void handleCopyText(IMPORT_JSON_EXAMPLE, "Exemplo de JSON copiado.")}
                className="text-xs font-medium text-blue-700 hover:text-blue-900"
              >
                Copiar exemplo
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-white p-3 text-xs text-gray-800">
              {IMPORT_JSON_EXAMPLE}
            </pre>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-gray-700">Prompt para IA</label>
              <button
                type="button"
                onClick={() => void handleCopyText(importAiPrompt, "Prompt para IA copiado.")}
                className="text-xs font-medium text-blue-700 hover:text-blue-900"
              >
                Copiar prompt
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-white p-3 text-xs text-gray-800">
              {importAiPrompt}
            </pre>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modo de importação</label>
            <select
              value={importMode}
              onChange={(event) => setImportMode(event.target.value as ImportMode)}
              className="border w-full p-2 rounded"
            >
              {IMPORT_MODE_OPTIONS.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">JSON</label>
            <textarea
              value={importJsonText}
              onChange={(event) => setImportJsonText(event.target.value)}
              className="border w-full p-3 rounded min-h-56 font-mono text-sm"
              placeholder="Cole aqui o JSON para importar."
            />
          </div>
        </div>
      </CreateItemModal>

      <CreateItemModal
        title="Importar Palavras por Arquivo"
        isOpen={modalType === "importFile"}
        onConfirm={handleImportFile}
        onClose={() => setModalType(null)}
        confirmLabel="Importar Arquivo"
        isConfirmDisabled={!importFile}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modo de importação</label>
            <select
              value={importMode}
              onChange={(event) => setImportMode(event.target.value as ImportMode)}
              className="border w-full p-2 rounded"
            >
              {IMPORT_MODE_OPTIONS.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo</label>
            <input
              type="file"
              accept=".json,.md,.markdown"
              onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
              className="border w-full p-2 rounded"
            />
            <p className="text-xs text-gray-500 mt-2">Formatos suportados: .json, .md e .markdown</p>
          </div>
        </div>
      </CreateItemModal>
    </div>
  )
}

export default Category
