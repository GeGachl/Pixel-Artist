export default function drawPixel(
  e,
  canvas,
  ctx,
  colorPicker,
  pixelSize,
  isErasing,
  opacity,

  pixelSizeModify,
) {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize
  const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize

  if (isErasing) {
    //ctx.clearRect(x, y, pixelSize, pixelSize)
    if (pixelSizeModify == 1) {
      ctx.clearRect(x, y, pixelSize, pixelSize)
    } else if (pixelSizeModify == 2) {
      ctx.clearRect(
        x - pixelSize * (0.5 * pixelSizeModify),
        y - pixelSize * (0.5 * pixelSizeModify),
        pixelSize,
        pixelSize,
      )
      ctx.clearRect(x, y, pixelSize, pixelSize)
      ctx.clearRect(
        x - pixelSize * (0.5 * pixelSizeModify),
        y,
        pixelSize,
        pixelSize,
      )
      ctx.clearRect(
        x,
        y - pixelSize * (0.5 * pixelSizeModify),
        pixelSize,
        pixelSize,
      )
    } else if (pixelSizeModify > 2) {
      const originalPixel = {
        x: x - pixelSize * (0.5 * pixelSizeModify),
        y: y - pixelSize * (0.5 * pixelSizeModify),
      }

      const CoordsArray = []
      for (let i = 0; i < pixelSizeModify; i++) {
        CoordsArray.push(
          CoordsArray.length == 0
            ? { x: originalPixel.x, y: originalPixel.y }
            : {
                x: CoordsArray[CoordsArray.length - 1].x,
                y: CoordsArray[CoordsArray.length - 1].y + pixelSize,
              },
        )
        ctx.clearRect(
          CoordsArray[CoordsArray.length - 1].x,
          CoordsArray[CoordsArray.length - 1].y,
          pixelSize,
          pixelSize,
        )
      }
      for (let i = 0; i < pixelSizeModify; i++) {
        for (let j = 0; j < pixelSizeModify - 1; j++) {
          ctx.clearRect(
            CoordsArray[i].x + pixelSize * (j + 1),
            CoordsArray[i].y,
            pixelSize,
            pixelSize,
          )
        }
      }
    }
  } else {
    ctx.globalAlpha = opacity
    ctx.fillStyle = colorPicker
    if (pixelSizeModify == 1) {
      ctx.fillRect(x, y, pixelSize, pixelSize)
    } else if (pixelSizeModify == 2) {
      ctx.fillRect(
        x - pixelSize * (0.5 * pixelSizeModify),
        y - pixelSize * (0.5 * pixelSizeModify),
        pixelSize,
        pixelSize,
      )
      ctx.fillRect(x, y, pixelSize, pixelSize)
      ctx.fillRect(
        x - pixelSize * (0.5 * pixelSizeModify),
        y,
        pixelSize,
        pixelSize,
      )
      ctx.fillRect(
        x,
        y - pixelSize * (0.5 * pixelSizeModify),
        pixelSize,
        pixelSize,
      )
    } else if (pixelSizeModify > 2) {
      const originalPixel = {
        x: x - pixelSize * (0.5 * pixelSizeModify),
        y: y - pixelSize * (0.5 * pixelSizeModify),
      }

      const CoordsArray = []
      for (let i = 0; i < pixelSizeModify; i++) {
        CoordsArray.push(
          CoordsArray.length == 0
            ? { x: originalPixel.x, y: originalPixel.y }
            : {
                x: CoordsArray[CoordsArray.length - 1].x,
                y: CoordsArray[CoordsArray.length - 1].y + pixelSize,
              },
        )
        ctx.fillRect(
          CoordsArray[CoordsArray.length - 1].x,
          CoordsArray[CoordsArray.length - 1].y,
          pixelSize,
          pixelSize,
        )
      }
      for (let i = 0; i < pixelSizeModify; i++) {
        for (let j = 0; j < pixelSizeModify - 1; j++) {
          ctx.fillRect(
            CoordsArray[i].x + pixelSize * (j + 1),
            CoordsArray[i].y,
            pixelSize,
            pixelSize,
          )
        }
      }
    }
  }
}
