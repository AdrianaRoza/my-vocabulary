import type { Word } from "../types/word"

interface CardProps {
  word: Word
}

const Card = ({word}: CardProps) => {
	return (
		<div 
			className=""
		>
			<img 
				src={word.image.url} 
				alt={word.image.name} 
				className="w-full h-full object-cover rounded-4xl
				transition duration-700 ease-in-out hover:scale-105" 
			/>
		</div>
	)
}

export default Card
