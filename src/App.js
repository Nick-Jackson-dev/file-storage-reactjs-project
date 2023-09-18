import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

//page components
import DocumentStore from "./pages/DocumentStore"
import DocumentsFolder from "./pages/DocumentsFolder"

//css
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DocumentStore />} />
        <Route path="additional-docs" element={<DocumentStore />} />
        <Route path="additional-docs/:folderId" element={<DocumentsFolder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
