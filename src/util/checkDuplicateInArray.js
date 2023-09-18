//take an array of objects or strings and check if a value already exists witihin it.
//if array of strings or some other non-object no need for propertiesToCheck argument in call
//propertiesToCheck can be an array of several properties

export default function checkDuplicateInArray(
  arrayToCheck,
  checkData,
  propertiesToCheck
) {
  let exists = false
  let duplicateData = null
  let duplicateProperty = ""
  //console.log(arrayToCheck, "checking for", checkData)

  //if the array has 0 elements exists is false
  if (arrayToCheck.length === 0)
    return { exists, duplicateProperty, duplicateData }

  //handle all non-object arrays first.
  if (typeof arrayToCheck[0] === "string") {
    exists = arrayToCheck.includes(checkData)
    duplicateData = checkData
  } else {
    if (!propertiesToCheck)
      return console.log(
        "error: an object was passed to checkDuplicateInArray function, but no properties to check were passed"
      )

    arrayToCheck.forEach((data) => {
      if (Array.isArray(propertiesToCheck)) {
        propertiesToCheck.forEach((prop) => {
          if (
            typeof checkData === "string" &&
            checkData.toLowerCase() === data[prop].toLowerCase()
          ) {
            exists = true
            duplicateData = data
            duplicateProperty = prop
          } else if (checkData === data[prop]) {
            exists = true
            duplicateData = data
            duplicateProperty = prop
          }
        })
      } else {
        if (
          typeof checkData === "string" &&
          checkData.trim().toLowerCase() ===
            data[propertiesToCheck].trim().toLowerCase()
        ) {
          exists = true
          duplicateData = data
        } else if (checkData === data[propertiesToCheck]) {
          exists = true
          duplicateData = data
        }
      }
    })
  }

  return { exists, duplicateData, duplicateProperty }
}
