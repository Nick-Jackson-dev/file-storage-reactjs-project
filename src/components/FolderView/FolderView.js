import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDocumentContext } from "../../hooks/useDocumentContext"
import FolderSubfolderList from "./FolderSubfolderList"
import FolderDocumentList from "./FolderDocumentList"
import MoveDocumentsModal from "./MoveDocumentsModal"
import {
  useDocumentStore,
  useDocumentStoreFolders,
  AddDocumentForm,
  AddSubfolderForm,
} from "../../index"

//components
import { Button } from "react-bootstrap"
import MoveFolderModal from "./MoveFolderModal"

export default function FolderView({ user }) {
  const navigate = useNavigate()
  const { folderId, companyId } = useParams()
  const { documentFolders, additionalDocuments } = useDocumentContext()
  const {
    uploadDocument,
    deleteCurrentDocument,
    deleteDocumentAndHistory,
    deleteDocumentFromHistory,
    error,
    isPending,
  } = useDocumentStore()
  const {
    addFolder,
    error: folderError,
    isPending: folderPending,
  } = useDocumentStoreFolders()

  const thisFolderId = typeof folderId !== "undefined" ? folderId : "root"

  //displayData control
  const [searchBy, setSearchBy] = useState("")

  //folders
  const subfolders = documentFolders.filter(
    (folder) => `${folder.parentFolderId}` === `${thisFolderId}`
  )
  const thisFolder =
    thisFolderId !== "root"
      ? documentFolders.find((folder) => `${folder.id}` === `${thisFolderId}`)
      : { name: "root", id: "root", isInternal: false, parentFolderId: null }

  const handleSubfolderNav = (subfolderId) => {
    if (folderId === "root") navigate(`${subfolderId}`)
    else navigate(`../additional-docs/${subfolderId}`)
  }

  const filteredDocuments = useGetFilteredData(
    additionalDocuments,
    thisFolderId,
    searchBy
  )

  //form control
  const [addingDoc, setAddingDoc] = useState(false)
  const [newDocName, setNewDocName] = useState("")
  const [addingSubfolder, setAddingSubfolder] = useState(false)

  const reviseDocument = (name) => {
    setAddingDoc(true)
    setNewDocName(name)
  }

  //file move and modal control
  const [showMoveDocsModal, setShowMoveDocsModal] = useState(false)
  const handleShowMoveDocsModal = () => setShowMoveDocsModal(true)
  const handleHideMoveDocsModal = () => setShowMoveDocsModal(false)
  const [documentToMove, setDocumentToMove] = useState(null)
  const startMoveDocument = (document) => {
    setDocumentToMove(document)
    handleShowMoveDocsModal()
  }

  //folder move and modal control
  const [showMoveFolderModal, setShowMoveFolderModal] = useState(false)
  const handleShowMoveFolderModal = () => setShowMoveFolderModal(true)
  const handleHideMoveFolderModal = () => setShowMoveFolderModal(false)
  const [folderToMove, setFolderToMove] = useState(null)
  const startMoveFolder = (folder) => {
    setFolderToMove(folder)
    handleShowMoveFolderModal()
  }

  return (
    <>
      <div className="d-flex mb-3 flex-wrap">
        <Button
          variant="primary"
          disabled={addingDoc || isPending || folderPending || addingSubfolder}
          onClick={() => setAddingSubfolder(true)}
          className="me-4"
        >
          Create Subfolder
        </Button>
        <Button
          variant="primary"
          disabled={addingDoc || isPending || folderPending || addingSubfolder}
          onClick={() => setAddingDoc(true)}
        >
          Add Document
        </Button>
        {/* Searchbar */}
        <input
          style={{ width: "250px", margin: "0" }}
          className="ms-md-auto me-5 mt-2"
          type="search"
          onChange={(e) => setSearchBy(e.target.value)}
          value={searchBy}
          placeholder="search folder"
        />
      </div>
      {/* {error && <p className="error">{error}</p>} */}
      {folderError && <p className="error">{folderError}</p>}
      {addingDoc && (
        <AddDocumentForm
          documents={additionalDocuments}
          folderId={thisFolderId}
          setAddingDoc={setAddingDoc}
          newDocName={newDocName}
          setNewDocName={setNewDocName}
          handleUpload={uploadDocument}
        />
      )}
      {addingSubfolder && (
        <AddSubfolderForm
          parentFolder={thisFolder}
          setAddingSubfolder={setAddingSubfolder}
          handleAdd={addFolder}
        />
      )}
      {/* List of Subfolders in folder */}
      <FolderSubfolderList
        subfolders={subfolders}
        folderId={thisFolderId}
        handleDoubleClick={handleSubfolderNav}
        callStartMove={startMoveFolder}
      />
      {/* List of Documents in folder */}
      <FolderDocumentList
        documents={filteredDocuments}
        callStartMove={startMoveDocument}
        callRevise={reviseDocument}
        callDeleteCurrent={deleteCurrentDocument}
        callDeleteAll={deleteDocumentAndHistory}
        callDeleteHistoricalDocument={deleteDocumentFromHistory}
      />

      {/* Modals */}
      {showMoveDocsModal && (
        <MoveDocumentsModal
          show={showMoveDocsModal}
          handleClose={handleHideMoveDocsModal}
          document={documentToMove}
        />
      )}

      {showMoveFolderModal && (
        <MoveFolderModal
          show={showMoveFolderModal}
          handleClose={handleHideMoveFolderModal}
          folder={folderToMove}
        />
      )}
    </>
  )
}

const useGetFilteredData = (items, folderId, searchBy) => {
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    let newList = []
    //create arrray of documents
    if (items.length) {
      newList = items.filter(
        (item) =>
          `${item.folderId}` === `${folderId}` &&
          item.name.trim().toLowerCase().includes(searchBy.trim().toLowerCase())
      )
    }

    setFilteredData(newList)
  }, [items, folderId, searchBy])

  return filteredData
}
