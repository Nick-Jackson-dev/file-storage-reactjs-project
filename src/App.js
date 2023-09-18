import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

//page components

//css
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
