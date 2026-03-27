import type { ReactNode } from "react"

type CreateItemModalProps = {
  title: string
  placeholder?: string
  value?: string
  isOpen: boolean
  onChange?: (value: string) => void
  onConfirm: () => void
  onClose: () => void
  confirmLabel?: string
  isConfirmDisabled?: boolean
  children?: ReactNode
}

const CreateItemModal = ({
  title,
  placeholder,
  value = "",
  isOpen,
  onChange,
  onConfirm,
  onClose,
  confirmLabel = "Adicionar",
  isConfirmDisabled = false,
  children,
}: CreateItemModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">
          {children ?? (
            <input
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder={placeholder}
            />
          )}
        </div>

        <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateItemModal
