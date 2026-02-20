import { words } from "../mock/words"
import Card from "./CardFlip"


const Grid = () => {
	return (
		<div 
      className="grid grid-cols-3 gap-3"
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
