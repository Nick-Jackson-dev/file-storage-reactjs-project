const getBreadCrumbs = ({ allFolders, endFolderId }) => {
  let crumbs = []
  let thisFolder = allFolders.find((folder) => {
    return `${folder.id}` === `${endFolderId}`
  })
  if (typeof thisFolder === "undefined") return crumbs

  crumbs.push(thisFolder)
  while (thisFolder.parentFolderId !== "root") {
    thisFolder = allFolders.find(
      (folder) => `${folder.id}` === `${thisFolder.parentFolderId}`
    )
    crumbs.push(thisFolder)
  }
  //console.log(crumbs.reverse())
  return crumbs.reverse()
}

export { getBreadCrumbs }
