export default function drawPixelWithNoise(
  e,
  canvas,
  ctx,
  colorPicker,
  pixelSize,
  opacity,
  pixelSizeModify,
) {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / pixelSize)
  const y = Math.floor((e.clientY - rect.top) / pixelSize)

  const radius = Math.floor(pixelSizeModify / 2.2)

  ctx.globalAlpha = opacity

  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      const distance = Math.sqrt(i * i + j * j)

      if (distance <= radius) {
        const drawX = (x + j) * pixelSize
        const drawY = (y + i) * pixelSize

        ctx.fillStyle = colorPicker
        ctx.fillRect(drawX, drawY, pixelSize, pixelSize)
      }
    }
  }
}
