export const CanvasEllipseMouseDown = (
  e,
  canvas,
  ctx,
  setStartX,
  setStartY,
  pixelSize,
  setDrawing,
  setCancelled,
  setSavedImage,
) => {
  if (e.button === 2) return
  const rect = canvas.getBoundingClientRect()
  setStartX(Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize)
  setStartY(Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize)
  setDrawing(true)
  setCancelled(false)
  setSavedImage(ctx.getImageData(0, 0, canvas.width, canvas.height))
}

export const CanvasEllipseMouseMove = (
  e,
  canvas,
  overlayCtx,
  overlay,
  drawing,
  pixelSize,
  startX,
  startY,
  shiftPressed,
  fill,
  pixelSizeModify,
) => {
  if (!drawing) return
  const rect = canvas.getBoundingClientRect()
  const endX = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize
  const endY = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize

  let width = endX - startX
  let height = endY - startY

  if (shiftPressed) {
    const side = Math.min(Math.abs(width), Math.abs(height))
    width = width < 0 ? -side : side
    height = height < 0 ? -side : side
  }

  overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
  drawEllipsePixelated(
    overlay,
    overlayCtx,
    startX,
    startY,
    width,
    height,
    true,
    '#000000',
    fill,
    pixelSizeModify,
    pixelSize,
  )
}

export const CanvasEllipseMouseUp = (
  e,
  canvas,
  ctx,
  overlay,
  overlayCtx,
  drawing,
  cancelled,
  pixelSize,
  startX,
  startY,
  shiftPressed,
  CurCol,
  fill,
  pixelSizeModify,
) => {
  if (e.button === 2 || !drawing) return
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height)

  if (!cancelled) {
    const rect = canvas.getBoundingClientRect()
    const endX = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize
    const endY = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize

    let width = endX - startX
    let height = endY - startY

    if (shiftPressed) {
      const side = Math.min(Math.abs(width), Math.abs(height))
      width = width < 0 ? -side : side
      height = height < 0 ? -side : side
    }

    drawEllipsePixelated(
      canvas,
      ctx,
      startX,
      startY,
      width,
      height,
      false,
      CurCol,
      fill,
      pixelSizeModify,
      pixelSize,
    )
  }
}

export const CanvasEllipseContextMenu = (
  e,
  overlay,
  ctx,
  overlayCtx,
  drawing,
  setCancelled,
  savedImage,
) => {
  e.preventDefault()
  if (drawing) {
    drawing = false
    setCancelled(true)
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
    ctx.putImageData(savedImage, 0, 0)
  }
}

export const drawEllipsePixelated = (
  canvas,
  targetCtx,
  x,
  y,
  width,
  height,
  preview = false,
  colorPicker,
  fillCheckbox,
  borderWidth,
  pixelSize,
) => {
  const color = preview ? 'rgba(0,0,0,0.3)' : colorPicker
  const fill = fillCheckbox

  const xStart = width >= 0 ? x : x + width
  const yStart = height >= 0 ? y : y + height
  const w = Math.abs(width)
  const h = Math.abs(height)

  const buffer = document.createElement('canvas')
  buffer.width = canvas.width
  buffer.height = canvas.height
  const bufferCtx = buffer.getContext('2d')

  bufferCtx.clearRect(0, 0, buffer.width, buffer.height)
  bufferCtx.strokeStyle = color
  bufferCtx.fillStyle = color
  bufferCtx.lineWidth =
    (borderWidth == 1 ? borderWidth / 5 : borderWidth / 2) * pixelSize

  bufferCtx.beginPath()
  bufferCtx.ellipse(
    xStart + w / 2,
    yStart + h / 2,
    w / 2,
    h / 2,
    0,
    0,
    Math.PI * 2,
  )
  if (fill) bufferCtx.fill()
  bufferCtx.stroke()

  const imageData = bufferCtx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  ).data

  const gridW = Math.ceil(canvas.width / pixelSize)
  const gridH = Math.ceil(canvas.height / pixelSize)
  const grid = Array.from({ length: gridW }, () => Array(gridH).fill(0))

  for (let gx = 0; gx < gridW; gx++) {
    for (let gy = 0; gy < gridH; gy++) {
      const x0 = gx * pixelSize
      const y0 = gy * pixelSize

      outer: for (let dx = 0; dx < pixelSize; dx++) {
        for (let dy = 0; dy < pixelSize; dy++) {
          const px = x0 + dx
          const py = y0 + dy
          const index = (py * canvas.width + px) * 4
          if (imageData[index + 3] > 0) {
            grid[gx][gy] = 1
            break outer
          }
        }
      }
    }
  }

  const cleaned = cleanIsolatedPixels(grid, gridW, gridH)

  for (let gx = 0; gx < gridW; gx++) {
    for (let gy = 0; gy < gridH; gy++) {
      if (cleaned[gx][gy]) {
        targetCtx.fillStyle = color
        targetCtx.fillRect(gx * pixelSize, gy * pixelSize, pixelSize, pixelSize)
      }
    }
  }
}

function cleanIsolatedPixels(grid, w, h) {
  const result = grid.map((row) => row.slice())
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (!grid[x][y]) continue

      const up = y > 0 ? grid[x][y - 1] : 0
      const down = y < h - 1 ? grid[x][y + 1] : 0
      const left = x > 0 ? grid[x - 1][y] : 0
      const right = x < w - 1 ? grid[x + 1][y] : 0

      if (up + down + left + right === 0) {
        result[x][y] = 0 // одиночный пиксель удаляем
      }
    }
  }
  return result
}
