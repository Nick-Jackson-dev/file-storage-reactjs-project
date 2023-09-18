import { useGetBreadCrumbs } from "../index"

export default function FolderBreadCrumbs({
  allFolders,
  thisFolderId,
  handleClick,
}) {
  const crumbs = useGetBreadCrumbs({
    allFolders,
    endFolderId: thisFolderId,
  })

  return (
    <div className="d-flex mb-3">
      <p className="me-2">
        <span
          onClick={() => handleClick("")}
          className="clickable text-decoration-underline text-muted"
        >
          Doc Store
        </span>{" "}
        >{" "}
      </p>
      {crumbs.length !== 0 &&
        crumbs.map((crumb, i) => (
          <p className="me-2" key={crumb.id}>
            <span
              className={
                i !== crumbs.length - 1
                  ? "me-2 clickable text-decoration-underline text-muted"
                  : "fw-bold"
              }
              onClick={() => handleClick(crumb.id)}
            >
              {crumb.name}
            </span>
            {i !== crumbs.length - 1 && <span>></span>}
          </p>
        ))}
    </div>
  )
}
