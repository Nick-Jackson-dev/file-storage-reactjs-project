import { useState, useEffect } from "react"
import { getBreadCrumbs } from "../index"

const useGetBreadCrumbs = ({ allFolders, endFolderId }) => {
  const [crumbsList, setCrumbsList] = useState([])
  useEffect(() => {
    const crumbs = getBreadCrumbs({ allFolders, endFolderId })
    setCrumbsList(crumbs)
  }, [endFolderId])
  return crumbsList
}

export { useGetBreadCrumbs }
