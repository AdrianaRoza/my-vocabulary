import { words } from "../mock/words"
import Card from "./CardFlip"


const Grid = () => {
	return (
		<div 
      className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 p-0"
    >
      {
        words.map((word) => (
          <Card
            key={word.id} 
            word={word}
          />
        ))
      }
		</div>
	)
}

export default Grid
