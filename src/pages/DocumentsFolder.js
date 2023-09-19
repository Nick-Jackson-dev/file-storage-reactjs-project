import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

// import { useAuthContext } from "../../authentication/index"
import { useDocumentContext } from "../hooks/useDocumentContext"
import { useDocumentStoreFolders } from "../hooks/useDocumentStoreFolders"
//components
import FolderView from "../components/FolderView/FolderView"
import FolderBreadCrumbs from "../components/FolderBreadCrumbs"
import { Button } from "react-bootstrap"

export default function DocumentsFolder() {
  const navigate = useNavigate()
  //   const { user } = useAuthContext()
  const { documentFolders } = useDocumentContext()
  const { folderId } = useParams()

  const { changeFolderName, error, isPending } = useDocumentStoreFolders()

  //form control
  const [changingName, setChangingName] = useState(false)
  const [newName, setNewName] = useState("")

  const handleClick = async () => {
    await changeFolderName({ folderId, newName })

    if (!error) setChangingName(false)
  }

  const folder = documentFolders.find((f) => `${f.id}` === `${folderId}`)
  //   const parentFolder =
  //     folder.parentFolderId === "root"
  //       ? { id: "root", parentFolderId: "root", name: "root", isInternal: false }
  //       : documentFolders.find((f) => `${f.id}` === `${folder.parentFolderId}`)

  if (typeof folder === "undefined")
    return <div className="error">No folder with id {folderId} </div>

  const handleBreadCrumbClick = (crumbId) => {
    navigate(`../additional-docs/${crumbId}`)
  }

  return (
    <>
      <div className="d-flex align-items-baseline">
        {!changingName && <h1 className="mt-2">{folder.name}</h1>}
        {changingName && (
          <>
            <input
              type="text"
              placeholder={folder.name}
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value.replace("/", "-"))
              }}
              style={{ height: "1.75em", fontSize: "1.75em", width: "200px" }}
              className="mt-2"
            />
            <Button
              variant="primary"
              className="ms-2 me-2 btn-sm"
              onClick={() => handleClick()}
              disabled={isPending}
            >
              Save
            </Button>
          </>
        )}

        <p
          className="ms-3 me-3 clickable text-muted text-decoration-underline fs-6"
          onClick={() => {
            setChangingName((prevValue) => !prevValue)
            setNewName("")
          }}
        >
          {!changingName && "Rename"}
          {changingName && "Cancel"}
        </p>

        {/* {!changingName && (
          <>
            <Button
              variant="primary"
              className="ms-4"
              onClick={() => makeFolderInternal(folderId)}
              disabled={isPending}
            >
              Make Internal
            </Button>
          </>
        )} 
         {!changingName && (
          <>
            <i className="text-muted fs-6 ms-2">(internal)</i>

            <Button
              variant="primary"
              className="ms-4"
              onClick={() => makeFolderPublic(folderId)}
              disabled={isPending}
            >
              Make Public
            </Button>
          </>
        )} */}
      </div>

      {/* Breadcrumbs here */}
      <FolderBreadCrumbs
        allFolders={documentFolders}
        thisFolderId={folderId}
        handleClick={handleBreadCrumbClick}
      />

      <FolderView />
    </>
  )
}
