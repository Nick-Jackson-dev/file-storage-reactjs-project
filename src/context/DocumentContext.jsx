//compatible with firebase 9 and react
import { createContext, useReducer, useEffect } from "react"
import { useCollection } from "../hooks/useCollection"
import { useDocument } from "../hooks/useDocument"

export const DocumentContext = createContext()

export const DocumentReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_DOCUMENT_FOLDERS":
      return { ...state, documentFolders: action.payload }
    case "UPDATE_ADDITIONAL_DOCUMENT_LIST":
      return { ...state, additionalDocuments: action.payload }
    default:
      return state
  }
}

export const DocumentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DocumentReducer, {
    documentFolders: [],
    additionalDocuments: [],
  })

  const { docData: documentStoreDocuments } = useDocument(
    "additionalDocuments/documentClassification"
  )
  const { documents: additionalDocuments } = useCollection(
    "additionalDocuments"
  )

  useEffect(() => {
    if (documentStoreDocuments) {
      dispatch({
        type: "UPDATE_DOCUMENT_FOLDERS",
        payload: documentStoreDocuments.folders,
      })
    }
  }, [documentStoreDocuments])

  useEffect(() => {
    if (additionalDocuments.length) {
      const actualDocs = additionalDocuments.filter(
        (document) => typeof document.name !== "undefined"
      )
      dispatch({
        type: "UPDATE_ADDITIONAL_DOCUMENT_LIST",
        payload: actualDocs,
      })
    }
  }, [additionalDocuments])

  return (
    <DocumentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DocumentContext.Provider>
  )
}
