import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Category from "./pages/Category"
import Layout from "./pages/Layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
