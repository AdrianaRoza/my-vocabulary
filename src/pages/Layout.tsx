import { Outlet, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

import { useUserStore } from "../store/userStore"
import { users } from "../mock/users"

const Layout = () => {
  const { userId } = useParams()

  const setCurrentUser = useUserStore((state) => state.setCurrentUser)
  const user = users.find(user => user.id === userId)

  if (user) {
    setCurrentUser(user)
  }

  return (
    <>
      <Navbar />
      
      <div className="mt-10">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
