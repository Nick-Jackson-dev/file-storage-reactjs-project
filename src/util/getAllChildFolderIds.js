const getAllChildFolderIds = ({ allFolders, folderId }) => {
  const subfolderIds = allFolders
    .filter((folder) => `${folder.parentFolderId}` === `${folderId}`)
    .map((folder) => folder.id)
  //console.log(subfolderIds)

  let go = Boolean(subfolderIds.length) //won't fire while if no subfolders
  let count = 0
  while (go) {
    let grandChildren = []
    subfolderIds.forEach((subfolderId) => {
      const newGrandchildren = allFolders
        .filter(
          (folder) =>
            `${folder.parentFolderId}` === `${subfolderId}` &&
            !subfolderIds.some((sfId) => sfId === folder.id)
        )
        .map((folder) => folder.id)
      grandChildren.push(...newGrandchildren)
      //console.log(newGrandchildren)

      if (grandChildren.length === 0 || count >= 100) {
        //safe guard
        go = false
        //console.log(count)
      }
    })
    count++
    //console.log(count)
    subfolderIds.push(...grandChildren)
  }

  return subfolderIds
}

export { getAllChildFolderIds }
