import { useEffect, useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { useDocumentContext } from "../../hooks/useDocumentContext"

import { FolderBreadCrumbs, useDocumentStoreFolders } from "../../index"
import FolderSubfolderList from "./FolderSubfolderList"

export default function MoveDocumentsModal({ show, handleClose, document }) {
  const { documentFolders } = useDocumentContext()
  const { error, isPending, moveFileToFolder } = useDocumentStoreFolders()

  const [selectedFolderId, setSelectedFolderId] = useState(document.folderId)
  const [subfolders, setSubfolders] = useState([])

  //update subfolders when selected folder changes
  useEffect(() => {
    let subfolderList = documentFolders.filter(
      (folder) => `${folder.parentFolderId}` === `${selectedFolderId}`
    )
    setSubfolders(subfolderList)
  }, [selectedFolderId, documentFolders])

  //handle the move
  const handleSubmit = async () => {
    await moveFileToFolder({
      destinationFolderId: selectedFolderId !== "" ? selectedFolderId : "root",
      documentId: document.name,
    })

    if (error) return console.log(error)

    handleModalClose()
  }

  const handleModalClose = () => {
    handleClose()
  }

  return (
    <div>
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Moving Document - {document.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "300px", overflowY: "scroll" }}>
          {selectedFolderId !== "" && (
            <FolderBreadCrumbs
              allFolders={documentFolders}
              thisFolderId={selectedFolderId}
              handleClick={(crumbId) => setSelectedFolderId(crumbId)}
            />
          )}

          <FolderSubfolderList
            subfolders={subfolders}
            handleDoubleClick={(subfolderId) =>
              setSelectedFolderId(subfolderId)
            }
            handleClick={(subfolderId) => setSelectedFolderId(subfolderId)}
            showIcons={false}
          />
          {error && <p className="error">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleModalClose}
            disabled={isPending}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              isPending || `${selectedFolderId}` === `${document.folderId}`
            }
          >
            Move here
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}