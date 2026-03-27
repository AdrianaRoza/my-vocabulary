import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import CardFlip from "../components/CardFlip"
import CreateItemModal from "../components/CreateItemModal"
import Grid from "../components/Grid"
import LoadingScreen from "../components/LoadingScreen"
import { getCategoriesByUser } from "../service/categoryApi"
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
import type { Word } from "../types/word"

type ModalType = "create" | "importJson" | "importFile" | null

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
  const [modalType, setModalType] = useState<ModalType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Estamos processando sua solicitação")
  const [importJsonText, setImportJsonText] = useState("")
  const [importMode, setImportMode] = useState<ImportMode>("skip")
  const [importFile, setImportFile] = useState<File | null>(null)

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

    setLoadingMessage("Estamos criando sua nova palavra")
    setIsLoading(true)

    try {
      setModalType(null)
      const response = await createWord({
        english: newWord.trim(),
        userId,
        categoryId,
      })

      toast.success(response.detail ?? "Palavra criada com sucesso.")
      setNewWord("")
      await fetchWords()
    } catch (error) {
      toast.error("Não foi possível criar a palavra.")
      console.error("Erro ao criar palavra:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWordUpdated = async (wordId: string, english: string) => {
    if (!userId || !categoryId) {
      toast.error("Categoria ou usuário inválido.")
      return
    }

    setLoadingMessage("Estamos atualizando sua palavra")
    setIsLoading(true)

    try {
      const response = await updateWord({
        wordId,
        english,
        userId,
        categoryId,
      })

      toast.success(response.detail ?? "Palavra atualizada com sucesso.")
      await fetchWords()
    } catch (error) {
      toast.error("Não foi possível atualizar a palavra.")
      console.error("Erro ao atualizar palavra:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWordDeleted = async (wordId: string) => {
    if (!userId) {
      toast.error("Usuário inválido.")
      return
    }

    setLoadingMessage("Estamos removendo sua palavra")
    setIsLoading(true)

    try {
      const response = await deleteWord({
        wordId,
        userId,
      })

      toast.success(response.detail ?? "Palavra removida com sucesso.")
      await fetchWords()
    } catch (error) {
      toast.error("Não foi possível excluir a palavra.")
      console.error("Erro ao excluir palavra:", error)
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

      toast.success(`Importação concluída: ${formatImportSummary(result)}`)
      if (result.errors.length > 0) {
        toast.warning(`Alguns itens falharam: ${result.errors[0].reason}`)
      }
      setImportJsonText("")
      setModalType(null)
      await fetchWords()
    } catch (error) {
      toast.error("Não foi possível importar o JSON.")
      console.error("Erro ao importar JSON:", error)
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

      toast.success(`Importação concluída: ${formatImportSummary(result)}`)
      if (result.errors.length > 0) {
        toast.warning(`Alguns itens falharam: ${result.errors[0].reason}`)
      }
      setImportFile(null)
      setModalType(null)
      await fetchWords()
    } catch (error) {
      toast.error("Não foi possível importar o arquivo.")
      console.error("Erro ao importar arquivo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{categoryTitle}</h1>

      {isLoading && (
        <LoadingScreen
          title="Quase lá..."
          content={loadingMessage}
        />
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => setModalType("create")}
          className="bg-linear-to-l from-gray-900 to-blue-800 text-white px-4 py-2 rounded"
        >
          + Adicionar Palavra
        </button>

        <button
          onClick={() => setModalType("importJson")}
          className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Importar JSON
        </button>

        <button
          onClick={() => setModalType("importFile")}
          className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Importar Arquivo
        </button>
      </div>

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
        placeholder="Digite a palavra"
        value={newWord}
        isOpen={modalType === "create"}
        onChange={setNewWord}
        onConfirm={addNewWord}
        onClose={() => setModalType(null)}
      />

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
