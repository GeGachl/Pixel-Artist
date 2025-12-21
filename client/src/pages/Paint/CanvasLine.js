/*const canvas = document.getElementById('canvas')
const overlay = document.getElementById('overlay')
const ctx = canvas.getContext('2d')
const overlayCtx = overlay.getContext('2d')*/
function getPixelCoords(e, canvas, pixelSize) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((e.clientX - rect.left) * scaleX) / pixelSize);
  const y = Math.floor(((e.clientY - rect.top) * scaleY) / pixelSize);
  return { x, y };
}

export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const CanvasLineOnMouseDown = (
  e,
  overlay,
  overlayCtx,
  ctx,
  firstPoint,
  setFirstPoint,
  colorPicker,
  pixelSize,
  pixelSizeModify,
) => {
  e.preventDefault()
  if (e.button === 2) {
    // правая кнопка — отмена
    setFirstPoint(null)
    clearOverlay(overlay, overlayCtx)
    return
  }

  const { x, y } = getPixelCoords(e, overlay, pixelSize)
  if (!firstPoint) {
    setFirstPoint({
      x,
      y: pixelSizeModify == 1 ? y : y,
    })
  } else {
    drawLine(
      ctx,
      firstPoint.x,
      firstPoint.y,
      x,
      y,
      colorPicker,
      pixelSize,
      pixelSizeModify,
    )
    setFirstPoint(null)
    clearOverlay(overlay, overlayCtx)
  }
}

function drawLine(ctx, x0, y0, x1, y1, color, pixelSize, pixelSizeModify) {
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy

  ctx.fillStyle = color

  while (true) {
    ctx.fillRect(
      x0 * pixelSize,
      y0 * pixelSize,
      pixelSize * pixelSizeModify,
      pixelSize * pixelSizeModify,
    )
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}

export function clearOverlay(overlay, overlayCtx) {
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height)
}

export const CanvasLineOverlayOnMouseMove = (
  e,
  firstPoint,
  overlay,
  overlayCtx,
  colorPicker,
  pixelSize,
  pixelSizeModify,
) => {
  if (!firstPoint) return
  const { x, y } = getPixelCoords(e, overlay, pixelSize)
  clearOverlay(overlay, overlayCtx)
  drawLine(
    overlayCtx,
    firstPoint.x,
    firstPoint.y,
    x,
    y,
    hexToRgba(colorPicker, 0.5),
    pixelSize,
    pixelSizeModify,
  )
}
