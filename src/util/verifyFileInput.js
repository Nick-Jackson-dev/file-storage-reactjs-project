const verifyPDF = (pdf) => {
  let error = null
  if (!pdf) error = "no file was selected"
  else if (!pdf.type.includes("pdf")) error = "Selected file must be a pdf"
  else if (pdf.size > 1000000) error = "File size must be less than 1Mb"
  else if (pdf.size < 500)
    error = "This does not appear to be a valid PDF based on small file size"

  console.log(error, pdf)

  return { pdf, error }
}

const verifyImage = (image) => {
  let error = null
  if (!image) error = "no file was selected"
  const fileExtension = getFileExtension(image)
  if (!image.type.includes("image"))
    error = "Selected file must be a jpg, png, or jpeg file type."
  else if (image.size > 1000000) error = "File size must be less than 1Mb"
  else if (image.size < 500)
    error =
      "This does not appear to be a valid picture based on small file size"

  return { image, error, fileExtension }
}

const getFileExtension = (file) => {
  return file.name.split(".")[file.name.split(".").length - 1]
}

const getMetadata = (file) => {
  const fileExtension = getFileExtension(file)
  let metadata = null
  metadata = { contentType: fileExtension.type }

  return metadata
}

export { verifyPDF, verifyImage, getFileExtension, getMetadata }
