import { useState } from "react"
import type { Word } from "../types/word"

interface CardProps {
  word: Word
}

const Card = ({word}: CardProps) => {
	const [flipped, setFlipped] = useState(false)
  const[menuOpen,setMenuOpen] = useState(false)

	return (
		<div 
			className="w-full aspect-5/6 perspective"
			onClick={() => setFlipped(!flipped)}
		>

			<div
				className={`relative w-full h-full transition-transform duration-500 
          transform-style ${
				flipped ? "rotate-y-180" : ""
				}`}
			>
        {/* Frente */}
        <div className="absolute w-full h-full backface-hidden rounded-xl 
          overflow-hidden shadow-lg bg-black">
          <img
            src={word.image.url}
            alt={word.image.name}
            className="w-full h-full object-cover
            transition duration-700 ease-in-out hover:scale-105"
          />

          <div className="absolute bottom-0 left-0 w-full p-2 flex justify-around">
            <button className="text-white text-sm bg-gray-800 px-2 py-1 rounded 
              hover:bg-gray-700">
              🔊
            </button>
          </div>
        </div>

        {/* Verso */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 
          rounded-xl bg-gray-900 text-white p-4 flex flex-col justify-center 
          items-center text-center shadow-lg"
          onMouseEnter={(e) => {
            e.stopPropagation()
            setMenuOpen(false)
          }}
          onMouseLeave={(e) => {
            e.stopPropagation()
            setMenuOpen(false)
          }}
        >       
          {/* Botão Hambúrguer */}
          <button 
            className="absolute top-2 left-2 text-white text-xl bg-gray- 
              px-2 py-1 rounded hover:bg-gray-700" 
            onClick={(e) =>{
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
          >
             ☰
          </button>
          
          
          {/* Menu suspenso */}
          {menuOpen &&(
            <div className="absolute top-12 left-2 bg-gray-800 rounded-lg 
              shadow-lg flex flex-col"
                 onClick={(e) => e.stopPropagation()}
            >
              <button className="px-4 py-2 hover:bg-gray-700 text-sm">English</button>
              <button className="px-4 py-2 hover:bg-gray-700 text-sm">Português</button>
              <button className="px-4 py-2 hover:bg-gray-700 text-sm">🔊 Audio</button>
            </div>
          )}
          {/* Conteúdo principal do verso */}
          <p className="text-lg font-semibold">{word.english}</p>
        </div>
      </div>
		</div>
	)
}

export default Card
