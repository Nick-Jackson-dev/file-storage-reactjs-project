import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

//page components
import DocumentStore from "./pages/DocumentStore"
import DocumentsFolder from "./pages/DocumentsFolder"

//css
import "./App.css"
import { Container } from "react-bootstrap"

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DocumentStore />} />
          <Route path="additional-docs" element={<DocumentStore />} />
          <Route
            path="additional-docs/:folderId"
            element={<DocumentsFolder />}
          />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

export default App
