import { useState } from "react"
import type { Word } from "../types/word"

interface CardProps {
  word: Word
}

const Card = ({word}: CardProps) => {
	const [flipped, setFlipped] = useState(false)

	return (
		<div 
			className="w-full aspect-5/6 perspective"
			onClick={() => setFlipped(!flipped)}
		>

			<div
				className={`relative w-full h-full transition-transform duration-500 transform-style ${
				flipped ? "rotate-y-180" : ""
				}`}
			>
        {/* Frente */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg bg-black">
          <img
            src={word.image.url}
            alt={word.image.name}
            className="w-full h-full object-cover
            transition duration-700 ease-in-out hover:scale-105"
          />
        </div>

        {/* Verso */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl bg-gray-900 text-white p-6 flex items-center justify-center text-center shadow-lg">
          <p>{word.english}</p>
        </div>
      </div>
		</div>
	)
}

export default Card
