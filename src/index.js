//*******Imports*******
//hooks
import { useGetDocumentsFromStore } from "./hooks/useGetDocumentsFromStore"
import { useDocumentStore } from "./hooks/useDocumentStore"
import { useDocumentStoreFolders } from "./hooks/useDocumentStoreFolders"
import { useGetBreadCrumbs } from "./hooks/useGetBreadCrumbs"

//pages
import DocumentsFolder from "./pages/DocumentsFolder"

//components
import FolderDocuments from "./components/FolderDocuments"
import AddDocumentForm from "./components/AddDocumentForm"
import AddSubfolderForm from "./components/AddSubfolderForm"
import FolderView from "./components/FolderView/FolderView"
import FolderBreadCrumbs from "./components/FolderBreadCrumbs"

//util
import { getBreadCrumbs } from "./util/getBreadCrumbs"
import { getAllChildFolderIds } from "./util/getAllChildFolderIds"

//
//
//***Exports***** */
//hooks
export {
  useGetDocumentsFromStore,
  useDocumentStore,
  useDocumentStoreFolders,
  useGetBreadCrumbs,
}

//pages
export { DocumentsFolder }

//components
export {
  FolderDocuments,
  AddDocumentForm,
  AddSubfolderForm,
  FolderView,
  FolderBreadCrumbs,
}

export { getBreadCrumbs, getAllChildFolderIds }
