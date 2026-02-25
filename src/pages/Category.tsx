import { useParams } from "react-router-dom"
import { words } from "../mock/words"
import Card from "../components/CardFlip"

const Category = () => {
  const { id } = useParams()

  const filteredWords = words.filter(word =>
    word.categoryIds?.includes(id || "")
  )

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {filteredWords.map(word => (
        <Card
          key={word.id} 
          word={word}
        />
      ))}
    </div>
  );
}

export default Category
