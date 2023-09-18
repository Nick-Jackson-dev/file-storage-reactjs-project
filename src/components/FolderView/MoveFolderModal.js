import { useEffect, useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { useDocumentContext } from "../../hooks/useDocumentContext"
import { useDocumentStoreFolders } from "../../hooks/useDocumentStoreFolders"
//components
import FolderBreadCrumbs from "../FolderBreadCrumbs"
import FolderSubfolderList from "./FolderSubfolderList"

//util
import { getAllChildFolderIds } from "../../util/getAllChildFolderIds"

export default function MoveFolderModal({ show, handleClose, folder }) {
  const { documentFolders } = useDocumentContext()
  const { error, isPending, changeParentFolder } = useDocumentStoreFolders()

  const childFolderIds = getAllChildFolderIds({
    allFolders: documentFolders,
    folderId: folder.id,
  })

  const [selectedFolderId, setSelectedFolderId] = useState(
    folder.parentFolderId
  )
  const [folderIdInView, setFolderIdInView] = useState(folder.parentFolderId)
  const [subfolders, setSubfolders] = useState([])

  //update subfolders when selected folder changes
  useEffect(() => {
    let subfolderList = documentFolders.filter((folder) => {
      if (selectedFolderId === "") {
        return folder.parentFolderId === "root"
      }
      return (
        `${folder.parentFolderId}` === `${selectedFolderId}` &&
        !childFolderIds.some((childId) => `${childId}` === `${folder.id}`)
      )
    })
    setSubfolders(subfolderList)
  }, [documentFolders, folderIdInView, selectedFolderId])

  //handle the move
  const handleSubmit = async () => {
    await changeParentFolder({
      destinationFolderId: selectedFolderId !== "" ? selectedFolderId : "root",
      subfolderId: folder.id,
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
          <Modal.Title>Moving Document - {folder.name}</Modal.Title>
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
          {/* <div className="me-auto">Seleted: {selectedFolderId}</div> */}
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
              isPending ||
              `${selectedFolderId}` === `${folder.id}` ||
              `${selectedFolderId}` === `${folder.parentFolderId}`
            }
          >
            Move here
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
