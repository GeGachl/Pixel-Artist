export default function drawSpray(
  e,
  canvas,
  ctx,
  colorPicker,
  pixelSize,
  opacity,
  pixelSizeModify,
) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor(((e.clientX - rect.left) * scaleX) / pixelSize);
  const y = Math.floor(((e.clientY - rect.top) * scaleY) / pixelSize);

  const sprayRadius = Math.floor(pixelSizeModify / 2)
  const density = 7

  ctx.globalAlpha = opacity

  for (let i = 0; i < density; i++) {
    const angle = Math.random() * 2 * Math.PI
    const radius = Math.random() * sprayRadius

    const drawX = Math.floor(x + radius * Math.cos(angle)) * pixelSize
    const drawY = Math.floor(y + radius * Math.sin(angle)) * pixelSize

    ctx.fillStyle = colorPicker
    ctx.fillRect(drawX, drawY, pixelSize, pixelSize)
  }
}
