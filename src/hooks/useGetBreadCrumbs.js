import { useState, useEffect } from "react"
import { getBreadCrumbs } from "../util/getBreadCrumbs"

const useGetBreadCrumbs = ({ allFolders, endFolderId }) => {
  const [crumbsList, setCrumbsList] = useState([])
  useEffect(() => {
    const crumbs = getBreadCrumbs({ allFolders, endFolderId })
    setCrumbsList(crumbs)
  }, [endFolderId])
  return crumbsList
}

export { useGetBreadCrumbs }
