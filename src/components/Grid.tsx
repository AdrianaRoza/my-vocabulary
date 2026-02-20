import { words } from "../mock/words"
import Card from "./Card"


const Grid = () => {
	return (
		<div 
      className="grid grid-cols-3 gap-3"
    >
      {
        words.map((word) => (
          <Card 
            word={word}
          />
        ))
      }
		</div>
	)
}

export default Grid
