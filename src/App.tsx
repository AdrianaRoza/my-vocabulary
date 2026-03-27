import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Category from "./pages/Category"
import Layout from "./pages/Layout"
import Profile from "./pages/Profile"
import Categories from "./pages/Categories"
import Texts from "./pages/Texts"
import ProtectedRoutes from "./routes/ProtectedRoutes"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/profile/:userId/categories/" element={<Categories />} />
            <Route path="/profile/:userId/category/:categoryId" element={<Category />} />
            <Route path="/profile/:userId/texts" element={<Texts />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
