export function hexToRgba(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3)
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  const bigint = parseInt(hex, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255]
}

export const CanvasFillClick = (e, canvas, ctx, pixelSize, colorPicker) => {
  const rect = canvas.getBoundingClientRect()
  const startX = Math.floor((e.clientX - rect.left) / pixelSize)
  const startY = Math.floor((e.clientY - rect.top) / pixelSize)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const sx = startX * pixelSize + Math.floor(pixelSize / 2)
  const sy = startY * pixelSize + Math.floor(pixelSize / 2)
  const targetColor = getPixelColor(imageData, sx, sy)
  const fillColor = hexToRgba(colorPicker)

  if (!colorsMatch(targetColor, fillColor)) {
    floodFillBlocks(
      imageData,
      startX,
      startY,
      targetColor,
      fillColor,
      pixelSize,
    )
    ctx.putImageData(imageData, 0, 0)
  }
}

function getPixelColor(imageData, x, y) {
  const index = (y * imageData.width + x) * 4
  const data = imageData.data
  return [data[index], data[index + 1], data[index + 2], data[index + 3]]
}

function setPixelColor(imageData, x, y, color) {
  const index = (y * imageData.width + x) * 4
  const data = imageData.data
  ;[data[index], data[index + 1], data[index + 2], data[index + 3]] = color
}

function colorsMatch(c1, c2) {
  return (
    c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3]
  )
}

function floodFillBlocks(imageData, x, y, targetColor, fillColor, pixelSize) {
  const wBlocks = Math.floor(imageData.width / pixelSize)
  const hBlocks = Math.floor(imageData.height / pixelSize)
  const visited = new Set()
  const stack = [[x, y]]

  while (stack.length) {
    const [bx, by] = stack.pop()
    if (bx < 0 || by < 0 || bx >= wBlocks || by >= hBlocks) continue
    const key = `${bx},${by}`
    if (visited.has(key)) continue
    visited.add(key)

    const cx = bx * pixelSize + Math.floor(pixelSize / 2)
    const cy = by * pixelSize + Math.floor(pixelSize / 2)
    if (!colorsMatch(getPixelColor(imageData, cx, cy), targetColor)) continue

    fillBlock(imageData, bx, by, fillColor, pixelSize)

    stack.push([bx + 1, by])
    stack.push([bx - 1, by])
    stack.push([bx, by + 1])
    stack.push([bx, by - 1])
  }
}

function fillBlock(imageData, bx, by, color, pixelSize) {
  const startX = bx * pixelSize
  const startY = by * pixelSize
  for (let dy = 0; dy < pixelSize; dy++) {
    for (let dx = 0; dx < pixelSize; dx++) {
      setPixelColor(imageData, startX + dx, startY + dy, color)
    }
  }
}
