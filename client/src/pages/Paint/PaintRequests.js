import UserRequests from '../../assets/functions/userRequests.js'

const sendImage = async (
  ctx,
  canvas,
  picturepublicity,
  pictureName,
  pictureDescription,
) => {
  const imageDataUrl = canvas.toDataURL('image/png')
  const painting = {
    name: pictureName,
    description: pictureDescription,
    publicity: picturepublicity,
    imageData: imageDataUrl,
  }
}
