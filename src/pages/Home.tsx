import Card from "../components/Card"
import { users } from "../mock/users"

export default function Home() {

  return (
    <>
			<div className="p-10">

				{/* Lista */}
				<div className="grid grid-cols-2 gap-4">
					{users.map((user) => (
						<Card 
              key={user.id} 
              user={user} 
            />
					))}
				</div>
			</div>
		
		</>
  )
}
