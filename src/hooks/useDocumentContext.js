import { useContext } from "react"
import { DocumentContext } from "../context/DocumentContext"

export const useDocumentContext = () => {
  const context = useContext(DocumentContext)

  if (context === undefined) {
    throw new Error(
      "useDocumentContext() must be used inside a DocumentProvider"
    )
  }

  return context
}
