import { Table } from "react-bootstrap"
import moveFileIcon from "../../assets/move-file-icon.svg"

export default function FolderSubfolderList({
  subfolders,
  folderId,
  handleDoubleClick,
  handleClick,
  showIcons = true,
  callStartMove,
}) {
  if (subfolders.length === 0) {
    return <p></p>
  }

  return (
    <Table striped hover bordered>
      <thead>
        <tr>
          <td className="fw-bold" width="70%">
            Subfolders:
          </td>
          {showIcons && <td className="fw-bold">Folder Actions</td>}
        </tr>
      </thead>
      <tbody>
        {subfolders.map((subfolder) => (
          <tr
            key={subfolder.id}
            className="clickable"
            onDoubleClick={() => {
              if (typeof handleDoubleClick !== "undefined")
                handleDoubleClick(subfolder.id)
            }}
            onClick={() => {
              if (typeof handleClick !== "undefined") handleClick(subfolder.id)
            }}
          >
            <td className="ps-5" width="70%">
              <span>{subfolder.name}</span>
              {subfolder.isInternal && (
                <i className="text-muted ms-2">(internal)</i>
              )}
            </td>
            {showIcons && (
              <td className="ps-5 text-align-right">
                <img
                  src={moveFileIcon}
                  alt="move folder"
                  title="move this folder to a different folder"
                  className="icon ms-2 me-2"
                  onClick={() => callStartMove(subfolder)}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
