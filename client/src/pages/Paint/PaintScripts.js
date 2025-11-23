export const ChangeTool = (event, setTool) => {
  const El =
    event.target.parentElement.tagName == 'DIV'
      ? event.target
      : event.target.parentElement
  setTool(El.getAttribute('class'))
}

export const ChangeCurCol = (e, setCurCol) => {
  setCurCol(e.target.value)
}

export const changeWidth = (e, setPixelsize) => {
  setPixelsize(
    Number(e.target.value) != 1 && Number(e.target.value) % 2 != 0
      ? Number(e.target.value) + 1
      : Number(e.target.value),
  )
}

export const changeOpacity = (e, setOpacity) => {
  setOpacity(e.target.value)
}

export const showWidthMenu = (setShowMenu, showMenu) => {
  setShowMenu(!showMenu)
}

export const showRectFillMenu = (setShowMenu, showMenu) => {
  setShowMenu(!showMenu)
}

export const showShadowMenu = (setShowMenu2, showMenu2) => {
  setShowMenu2(!showMenu2)
}

export const showSave = (showSaveMenu, setShowSaveMenu) => {
  setShowSaveMenu(!showSaveMenu)
}

export const checkboxPublicity = (publicity, setPublicity) => {
  setPublicity(!publicity)
}

export const AddPictureName = (event, setPictureName) => {
  const value = event.target.value
  setPictureName(value)
}

export const AddPictureDescription = (event, setPictureDescription) => {
  const value = event.target.value
  setPictureDescription(value)
}
