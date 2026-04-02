import { ImSpinner9 } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

// Tela simples de bloqueio usada durante operações importantes.
const LoadingScreen = ({
  title,
  content,
  variant = "loading",
}: {
  title: string
  content: string
  variant?: "loading" | "success" | "error"
}) => (
  <div className="w-screen h-screen flex flex-col justify-center items-center">
    {variant === "loading" ? (
      <ImSpinner9 
        className="text-blue-800" 
        size={36} 
        style={{ animation: 'spin 1s linear infinite' }} 
      />
    ) : variant === "success" ? (
      <FaCheckCircle className="text-emerald-600" size={40} />
    ) : (
      <MdErrorOutline className="text-rose-600" size={42} />
    )}
    <h2 className="mb-3 text-4xl">{title}</h2>
    <p className="text-zinc-600">{content}</p>
    
    {/* Define a animação do spinner localmente para evitar dependência extra */}
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
)

export default LoadingScreen
