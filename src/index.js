import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"

import { DocumentContextProvider } from "./context/DocumentContext"

import "./index.css"

const rootElement = document.getElementById("root")
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <DocumentContextProvider>
      <App />
    </DocumentContextProvider>
  </React.StrictMode>
)
