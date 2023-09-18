import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

import { useAuthContext } from "../../authentication/index"
import { useCompanyContext } from "../../company"
import { useDocumentStoreFolders } from "../index"
//layout
import ContentOptionalRight from "../../../components/layouts/ContentOptionalRight"
//components
import { FolderView, FolderBreadCrumbs } from "../index"
import { Button } from "react-bootstrap"
import InfoIcon from "../../../components/basicComponents/InfoIcon"

export default function DocumentsFolder() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { documentFolders } = useCompanyContext()
  const { folderId } = useParams()

  const {
    makeFolderPublic,
    makeFolderInternal,
    changeFolderName,
    error,
    isPending,
  } = useDocumentStoreFolders()

  //form control
  const [changingName, setChangingName] = useState(false)
  const [newName, setNewName] = useState("")

  const handleClick = async () => {
    await changeFolderName({ folderId, newName })

    if (!error) setChangingName(false)
  }

  const folder = documentFolders.find((f) => `${f.id}` === `${folderId}`)
  const parentFolder =
    folder.parentFolderId === "root"
      ? { id: "root", parentFolderId: "root", name: "root", isInternal: false }
      : documentFolders.find((f) => `${f.id}` === `${folder.parentFolderId}`)

  if (typeof folder === "undefined")
    return <div className="error">No folder with id {folderId} </div>

  const handleBreadCrumbClick = (crumbId) => {
    navigate(`../additional-docs/${crumbId}`)
  }

  return (
    <ContentOptionalRight
      contentTitle={
        <div className="d-flex align-items-baseline">
          {!changingName && folder.name}
          {changingName && (
            <>
              <input
                type="text"
                placeholder={folder.name}
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value.replace("/", "-"))
                }}
                style={{ height: "1.2em", width: "200px" }}
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
          {user.admin && (
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
          )}

          {!folder.isInternal && user.admin && !changingName && (
            <>
              <Button
                variant="primary"
                className="ms-4"
                onClick={() => makeFolderInternal(folderId)}
                disabled={isPending}
              >
                Make Internal
              </Button>
              <InfoIcon
                infoTitle="Internal Document Categories"
                className="fs-5"
              />
            </>
          )}
          {folder.isInternal && !changingName && (
            <>
              <i className="text-muted fs-6 ms-2">(internal)</i>
              {!parentFolder.isInternal && user.admin && (
                <Button
                  variant="primary"
                  className="ms-4"
                  onClick={() => makeFolderPublic(folderId)}
                  disabled={isPending}
                >
                  Make Public
                </Button>
              )}
            </>
          )}
        </div>
      }
      content={
        <>
          {/* Breadcrumbs here */}
          <FolderBreadCrumbs
            allFolders={documentFolders}
            thisFolderId={folderId}
            handleClick={handleBreadCrumbClick}
          />

          <FolderView user={user} />
        </>
      }
    />
  )
}
