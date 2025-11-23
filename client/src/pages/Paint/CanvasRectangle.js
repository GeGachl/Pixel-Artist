export const shiftListener = (setShiftPressed) => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') setShiftPressed(true)
  })
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') setShiftPressed(false)
  })
}

export const CanvasRectangleMouseDown = (
  e,
  canvas,
  ctx,
  pixelSize,
  setCancelled,
  setSavedImage,
  setStartX,
  setStartY,
) => {
  if (e.button === 2) return
  const rect = canvas.getBoundingClientRect()
  setStartX(Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize)
  setStartY(Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize)
  setCancelled(false)
  setSavedImage(ctx.getImageData(0, 0, canvas.width, canvas.height))
}

export const CanvasRectangleMouseMove = (
  e,
  isDrawing,
  canvas,
  overlay,
  overlayCtx,
  pixelSize,
  startX,
  startY,
  shiftPressed,
  color,
  fill,
  borderWidth,
) => {
  if (!isDrawing) return
  const rect = canvas.getBoundingClientRect()
  const endX =
    Math.floor((e.clientX - rect.left + pixelSize) / pixelSize) * pixelSize
  const endY =
    Math.floor((e.clientY - rect.top + pixelSize) / pixelSize) * pixelSize

  let width = endX - startX
  let height = endY - startY

  if (shiftPressed) {
    const side = Math.min(Math.abs(width), Math.abs(height))
    width = width < 0 ? -side : side
    height = height < 0 ? -side : side
  }

  overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
  drawRect(
    overlayCtx,
    startX,
    startY,
    width,
    height,
    true,
    '#000000',
    fill,
    pixelSize,
    borderWidth,
  )
}

export const CanvasRectangleMouseUp = (
  e,
  isDrawing,
  canvas,
  ctx,
  overlay,
  overlayCtx,
  cancelled,
  pixelSize,
  startX,
  startY,
  shiftPressed,
  color,
  fill,
  borderWidth,
) => {
  if (e.button === 2 || !isDrawing) return

  isDrawing = false
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height)

  if (!cancelled) {
    const rect = canvas.getBoundingClientRect()
    const endX =
      Math.floor((e.clientX - rect.left + pixelSize) / pixelSize) * pixelSize
    const endY =
      Math.floor((e.clientY - rect.top + pixelSize) / pixelSize) * pixelSize

    let width = endX - startX
    let height = endY - startY

    if (shiftPressed) {
      const side = Math.min(Math.abs(width), Math.abs(height))
      width = width < 0 ? -side : side
      height = height < 0 ? -side : side
    }

    drawRect(
      ctx,
      startX,
      startY,
      width,
      height,
      true,
      color,
      fill,
      pixelSize,
      borderWidth,
    )
  }
}

export const CanvasRectangleContextMenu = (
  e,
  isDrawing,
  cancelled,
  overlayCtx,
  overlay,
  ctx,
  savedImage,
) => {
  e.preventDefault() 
  if (isDrawing) {
    isDrawing = false
    cancelled = true
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
    ctx.putImageData(savedImage, 0, 0) 
  }
}

export const drawRect = (
  context,
  x,
  y,
  width,
  height,
  preview = false,
  color,
  fillCheckbox,
  pixelSize,
  borderWidth,
) => {
  const fill = fillCheckbox
  const drawPixel = (px, py) => {
    context.fillStyle = color
    context.fillRect(px, py, pixelSize, pixelSize)
  }

  const xStart = width >= 0 ? x : x + width
  const yStart = height >= 0 ? y : y + height
  const w = Math.abs(width)
  const h = Math.abs(height)

  if (fill || !preview) {
    for (let i = 0; i < w; i += pixelSize) {
      for (let j = 0; j < h; j += pixelSize) {
        drawPixel(xStart + i, yStart + j)
      }
    }
  }

  for (let bw = 0; bw < borderWidth; bw++) {
    for (let i = 0; i < w; i += pixelSize) {
      drawPixel(xStart + i, yStart + bw * pixelSize)
    }
    for (let i = 0; i < w; i += pixelSize) {
      drawPixel(xStart + i, yStart + h - pixelSize * (bw + 1))
    }
    for (let j = 0; j < h; j += pixelSize) {
      drawPixel(xStart + bw * pixelSize, yStart + j)
    }
    for (let j = 0; j < h; j += pixelSize) {
      drawPixel(xStart + w - pixelSize * (bw + 1), yStart + j)
    }
  }
}
