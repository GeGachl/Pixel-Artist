import styles from './Paint.module.css'
import { IoArrowUndo, IoArrowRedo } from 'react-icons/io5'
import {
  PiPencil,
  PiEraser,
  PiPaintBrush,
  PiRectangle,
  PiPaintBucket,
  PiSquareHalfFill,
} from 'react-icons/pi'
import { TbLine } from 'react-icons/tb'
import { RxCircle, RxWidth } from 'react-icons/rx'
import { TfiSpray } from 'react-icons/tfi'
import { BsShadows } from 'react-icons/bs'
import { FaGears } from 'react-icons/fa6'
import { MdGradient, MdLensBlur, MdOutlineColorLens } from 'react-icons/md'
import { useState, useEffect, useRef, refresh } from 'react'
import { useNavigate } from 'react-router'

import drawSpray from './CanvasSpray.js'
import drawPixelWithNoise from './CanvasFadedPixel.js'
import drawPixel from './CanvasScript.js'
import backgroundSvg from './Grid.js'
import {
  ChangeTool,
  ChangeCurCol,
  changeWidth,
  changeOpacity,
  showWidthMenu,
  showRectFillMenu,
  showShadowMenu,
  checkboxPublicity,
  AddPictureName,
  AddPictureDescription,
} from './PaintScripts.js'
import {
  CanvasLineOverlayOnMouseMove,
  CanvasLineOnMouseDown,
  clearOverlay,
  hexToRgba,
} from './CanvasLine.js'

import {
  shiftListener,
  CanvasRectangleContextMenu,
  CanvasRectangleMouseDown,
  CanvasRectangleMouseMove,
  CanvasRectangleMouseUp,
} from './CanvasRectangle.js'

import {
  CanvasEllipseMouseDown,
  CanvasEllipseMouseMove,
  CanvasEllipseMouseUp,
  CanvasEllipseContextMenu,
} from './CanvasEllipse.js'

import { CanvasFillClick } from './CanvasFill.js'
import { usePosts } from '../../store/postStore.js'
import { useAuth } from '../../store/authStore.js'
import { apiFetch } from '../../api/fetch.js'

export default function Paint() {
  const [CanvasWidth, setCanvasWidth] = useState(640)
  const [CanvasHeight, setCanvasHeight] = useState(640)
  const [ChangedCanvasWidth, setChangedCanvasWidth] = useState(640)
  const [ChangedCanvasHeight, setChangedCanvasHeight] = useState(640)
  const [fill, setFill] = useState(false)
  const [savedImage, setSavedImage] = useState()
  const [startX, setStartX] = useState()
  const [startY, setStartY] = useState()
  const [cancelled, setCancelled] = useState()
  const [shiftPressed, setShiftPressed] = useState(false)
  const [firstPoint, setFirstPoint] = useState()
  const [CurCol, setCurCol] = useState('#000000')
  const [activeTool, setTool] = useState('pencil')
  const [ctx, setCtx] = useState()
  const [overlayCtx, setOverlayCtx] = useState()
  const [showMenu, setShowMenu] = useState(false)
  const [showMenu3, setShowMenu3] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [pixelSize, setPixelsize] = useState(10)
  const [pixelSizeModify, setPixelsizeModify] = useState(2)
  const [showClue, setShowClue] = useState(false)
  const [showHelpBlock, setShowHelpBlock] = useState(false)
  const [publicity, setPublicity] = useState(false)
  const [pictureName, setPictureName] = useState('')
  const [pictureDescription, setPictureDescription] = useState('')
  const { posts, setPosts, clearPosts } = usePosts()
  const { access, refresh, id, canvasUrl, logout, setTokens } = useAuth()
  const nav = useNavigate()

  const [showSettings, setShowSettings] = useState(false)
  const [showBSettings, setShowBSettings] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showSaveSettings, setShowSaveSettings] = useState(false)
  const [showProjectSettings, setShowProjectSettings] = useState(false)
  const [showKeySettings, setShowKeySettings] = useState(false)
  const [showMenu2, setShowMenu2] = useState(false)
  const [opacity, setOpacity] = useState(0.1)
  const [extension, setExtension] = useState('')
  const [widthFordn, setWidthFordn] = useState(0)
  const [heightFordn, setHeightFordn] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [currentTool, setCurrentTool] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)

  const keyBind = localStorage.getItem('keyBindings')

  const [defaultKeyBindings, setDefaultKeyBindings] = useState(() => {
    if (keyBind) {
      JSON.parse(keyBind)
    } else {
      return {
        pencil: 'p',
        eraser: 'e',
        brush: 'b',
        line: 'l',
        rectangle: 'r',
        circle: 'c',
        bucket: 'u',
        text: 't',
        opacity: 'o',
        spray: 's',
        gradient: 'g',
        hand: 'h',
        noise: 'k',
        pipette: 'z',
      }
    }
  })
  const encodedSvg = encodeURIComponent(backgroundSvg)

  const [cansel, setCansel] = useState([])
  const [uncancel, setUncancel] = useState([])

  const canvasRef = useRef(null)
  const allKeys = {}
  useEffect(() => {
    function syncCanvasSize() {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const realWidth = canvasEl.offsetWidth;
      const realHeight = canvasEl.offsetHeight;
      if (CanvasWidth !== realWidth) setCanvasWidth(realWidth);
      if (CanvasHeight !== realHeight) setCanvasHeight(realHeight);
    }
    window.addEventListener('resize', syncCanvasSize);
    syncCanvasSize();

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const overlay = document.getElementById('overlay')
    const overlayCtx = overlay.getContext('2d')
    context.fillStyle = 'transparent'
    context.fillRect(0, 0, canvas.width, canvas.height)
    const initialImageData = canvas.toDataURL()
    setCansel([initialImageData])
    overlayCtx.fillStyle = 'transparent'
    overlayCtx.fillRect(0, 0, canvas.width, canvas.height)
    setOverlayCtx(overlayCtx)
    setCtx(context)
    return () => window.removeEventListener('resize', syncCanvasSize);
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('savedImage')
    if (saved) setSavedImage(saved)
  }, [])
  useEffect(() => {
    if (!ctx || !canvasUrl || imageLoaded) return

    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(img, 0, 0)
      setImageLoaded(true) // больше не загружать
    }
    img.src = localStorage.getItem('canvasUrl')
    localStorage.removeItem('canvasUrl')
  }, [ctx, canvasUrl, imageLoaded])

  const names = [
    'pencil',
    'eraser',
    'brush',
    'line',
    'rectangle',
    'circle',
    'bucket',
    'text',
    'opacity',
    'spray',
    'gradient',
    'hand',
    'noise',
    'pipette',
  ]

  window.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName == 'BODY') {
      for (let i = 0; i < names.length; i++) {
        if (defaultKeyBindings[names[i]].toLowerCase() == e.key) {
          setTool(names[i])
          if (e.key == 'o') {
            setShowMenu2(!showMenu2)
          }
          e.preventDefault()
          return
        }
      }
    }
  })

  const showInputBtn = () => {
    setShowInput(!showInput)
  }

  const writeValue = (e) => {
    const value = e.target.value

    setInputValue(value)
  }

  const inputBtn = () => {
    setShowInput(!showInput)
    defaultKeyBindings[currentTool] = inputValue
    localStorage.setItem('keyBindings', JSON.stringify(defaultKeyBindings))
    setInputValue('')
  }

  const png = () => {
    setExtension('png')
  }

  const jpg = () => {
    setExtension('jpg')
  }

  const gif = () => {
    setExtension('gif')
  }

  const mp4 = () => {
    setExtension('mp4')
  }

  const wdt = async (e) => {
    const value = e.target.value

    setWidthFordn(Number(value))
  }

  const hght = (e) => {
    const value = e.target.value

    setHeightFordn(Number(value))
  }

  const drawState = (state) => {
    const img = new Image()
    img.src = state
    img.onload = () => {
      ctx.clearRect(0, 0, CanvasHeight, CanvasWidth) 
      ctx.drawImage(img, 0, 0)
    }
  }
  shiftListener(setShiftPressed)
  const canselAction = () => {
    if (cansel.length > 1) {
      const canvas = canvasRef.current

      setUncancel((prevUncancel) => [...prevUncancel, canvas.toDataURL()])

      const lastState = cansel[cansel.length - 1]
      setCansel(cansel.slice(0, cansel.length - 1))

      drawState(lastState)
    } else if (cansel.length === 1) {
      const canvas = canvasRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setCansel([canvas.toDataURL()])
    }
  }

  const unCanselAction = () => {
    if (uncancel.length > 0) {
      const canvas = canvasRef.current
      setCansel((prevCansel) => [...prevCansel, canvas.toDataURL()])

      const nextState = uncancel[uncancel.length - 1]
      setUncancel(uncancel.slice(0, uncancel.length - 1))

      drawState(nextState)
    }
  }

  const showHelp = () => {
    setShowHelpBlock(!showHelpBlock)
  }

  const clearField = () => {
    ctx.clearRect(0, 0, 1000, 1000)
    setShowClue(!showClue)
  }

  const clue = () => {
    setShowClue(!showClue)
  }

  const addPost = async (e) => {
    e.preventDefault()
    const pictureDate = new Date().toLocaleDateString()
    const imageDataUrl = canvas.toDataURL('image/png')
    const res = await apiFetch('/main/cPic', {
      method: 'POST',
      headers: {
        Authorization: `${access}`,
        'Content-Type': 'application/json',
      },
      body: {
        pictureName,
        publicity,
        imageDataUrl,
        pictureDate,
        username: localStorage.getItem('username'),
      },
    })
    if (res.status === 201) {
      setPictureName('')
      setPublicity(false)
      setPosts([...posts, res.data])
    } else {
      alert(res.msg)
    }
  }

  const canvas = document.getElementById('draw')
  const overlay = document.getElementById('overlay')

  const openJPG = (event) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          canvas.style.background = `url(${img.src})`
          canvas.style.backgroundSize = 'cover'
        }
        img.src = e.target.result
      }

      reader.readAsDataURL(file)
    }
  }

  const downloadImg = () => {
    const newCanvas = document.createElement('canvas')
    newCanvas.width = widthFordn
    newCanvas.height = heightFordn
    const newCtx = newCanvas.getContext('2d')

    newCtx.drawImage(canvas, 0, 0, widthFordn, heightFordn)

    const dataURL = newCanvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'canvas_image.png'

    link.click()
  }

  const downloadImgJpg = () => {
    const newCanvas = document.createElement('canvas')
    newCanvas.width = widthFordn
    newCanvas.height = heightFordn
    const newCtx = newCanvas.getContext('2d')

    newCtx.fillStyle = 'white'
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height)

    newCtx.drawImage(canvas, 0, 0, widthFordn, heightFordn)

    const dataURL = newCanvas.toDataURL('image/jpeg', 0.9)

    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'canvas_image.jpg'

    link.click()
  }

  const settings = () => {
    setShowSettings(!showSettings)
  }
  const exportSettings = () => {
    setShowExport(!showExport)
    setShowBSettings(false)
    setShowSaveSettings(false)
    setShowProjectSettings(false)
    setShowKeySettings(false)
  }
  const saveSettings = () => {
    setShowSaveSettings(!showSaveSettings)
    setShowBSettings(false)
    setShowExport(false)
    setShowProjectSettings(false)
    setShowKeySettings(false)
  }
  const projectSettings = () => {
    setShowProjectSettings(!showProjectSettings)
    setShowBSettings(false)
    setShowExport(false)
    setShowSaveSettings(false)
    setShowKeySettings(false)
  }
  const keySettings = () => {
    setShowKeySettings(!showKeySettings)
    setShowBSettings(false)
    setShowExport(false)
    setShowSaveSettings(false)
    setShowProjectSettings(false)
  }
  const saveState = () => {
    const canvas = canvasRef.current
    setCansel((prevCansel) => [...prevCansel, canvas.toDataURL()])
    setUncancel([])
  }
  return (
    <div className={styles['wrapper']}>
      <div className={styles['topMenu']}>
        <div className={styles['menu']}>
          <div className={styles['left']}>
            <span onClick={clue}>Clear</span>
            <label style={{ cursor: 'pointer' }}>
              Open
              <input
                type="file"
                accept="image/*"
                style={{ rotate: '0deg', display: 'none' }}
                className={styles['file-input']}
                onChange={openJPG}
              />
            </label>
            <span
              onClick={() => {
                setShowSettings(
                  showSettings && showSaveSettings ? !showSettings : true,
                )
                setShowSaveSettings(!showSaveSettings)
                setShowExport(false)
                setShowBSettings(false)
                setShowProjectSettings(false)
                setShowKeySettings(false)
              }}
            >
              Save
            </span>
            <span
              onClick={() => {
                setShowSettings(
                  showSettings && showExport ? !showSettings : true,
                )
                setShowExport(!showExport)
                setShowBSettings(false)
                setShowSaveSettings(false)
                setShowProjectSettings(false)
                setShowKeySettings(false)
              }}
            >
              Export
            </span>
            <span style={{ cursor: 'default' }}>|</span>
            <IoArrowUndo
              style={{ cursor: 'pointer' }}
              className={styles['arrow1']}
              onClick={canselAction}
            />
            <IoArrowRedo
              style={{ cursor: 'pointer' }}
              className={styles['arrow2']}
              onClick={unCanselAction}
            />
          </div>
          <div className={styles['right']}>
            <span onClick={settings}>Settings</span>
            <span onClick={showHelp}>Help</span>
          </div>
        </div>
        <div className={styles['toolbar']}>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Pencil</span>
              <PiPencil
                className="pencil"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'pencil'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Eraser</span>
              <PiEraser
                className="eraser"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'eraser'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Brush</span>
              <PiPaintBrush
                className="brush"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'brush'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Line</span>
              <TbLine
                className="line"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'line'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Rectangle</span>
              <PiRectangle
                className="rectangle"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'rectangle'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Circle</span>
              <RxCircle
                className="circle"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'circle'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Bucket</span>
              <PiPaintBucket
                className="bucket"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'bucket'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Lighten/Darken</span>
              <div className={styles['widthMenu']}>
                <BsShadows
                  className="opacity"
                  style={{
                    cursor: 'pointer',
                    filter:
                      activeTool === 'opacity'
                        ? 'drop-shadow(0px 0px 3px white)'
                        : 'none',
                  }}
                  onClick={(event) => ChangeTool(event, setTool)}
                />
              </div>
            </div>
          </div>
          <div className={styles['widthMenu']}>
            <div className={styles['tipdiv']}>
              <span className={styles['tiptext']}>Spray</span>
              <TfiSpray
                className="spray"
                onClick={(event) => ChangeTool(event, setTool)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'spray'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles['canvas']}>
        <div className={styles['ToolSettingsBar']}>
          {!showMenu ? (
            <div className={styles['widthMenu']}>
              <div className={styles['tipdiv']}>
                <span
                  className={styles['tiptext']}
                  style={{ marginLeft: '80%', marginTop: '50%' }}
                >
                  Pixel Size
                </span>
                <RxWidth
                  className="width"
                  style={{ cursor: 'pointer' }}
                  onClick={() => showWidthMenu(setShowMenu, showMenu)}
                />
              </div>
            </div>
          ) : (
            <div className={styles['widthMenu']} style={{ marginTop: '20%' }}>
              <RxWidth
                className="width"
                onClick={() => showWidthMenu(setShowMenu, showMenu, setTool)}
                style={{
                  cursor: 'pointer',
                }}
              />
              <div className={styles['widthblock']}>
                <div className={styles['widthblock1']}>
                  <span>Pixel size</span>
                  <span>{`(${pixelSizeModify})`}</span>
                </div>
                <div className={styles['widthblock2']}>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={pixelSizeModify}
                    className={styles['width-input']}
                    onChange={(event) => changeWidth(event, setPixelsizeModify)}
                  />
                </div>
              </div>
            </div>
          )}
          {!showMenu3 ? (
            <div className={styles['widthMenu']}>
              <div className={styles['tipdiv']}>
                <span
                  className={styles['tiptext']}
                  style={{ marginLeft: '80%', marginTop: '50%' }}
                >
                  Figures Fill
                </span>
                <PiSquareHalfFill
                  className="rectangleFill"
                  style={{ cursor: 'pointer' }}
                  onClick={() => showRectFillMenu(setShowMenu3, showMenu3)}
                />
              </div>
            </div>
          ) : (
            <div
              className={styles['widthMenu']}
              style={{
                cursor: 'pointer',
              }}
            >
              <PiSquareHalfFill
                className="rectangleFill"
                onClick={() => showRectFillMenu(setShowMenu3, showMenu3)}
              />
              <div
                className={styles['widthblock']}
                style={{
                  padding: '3% 0 3% 15%',
                  minWidth: '365%',
                  marginLeft: '465%',
                }}
              >
                <div
                  className={styles['widthblock1']}
                  style={{
                    width: '100%',
                    justifyContent: 'start',
                    height: '100%',
                  }}
                >
                  <span>Rectangle Fill</span>
                  <input
                    type="checkbox"
                    style={{
                      marginLeft: '2%',
                      height: '100%',
                      aspectRatio: '1',
                    }}
                    checked={fill}
                    onChange={(e) => setFill(!fill)}
                  />
                </div>
              </div>
            </div>
          )}
          {!showMenu2 ? (
            <div
              className={`${styles['widthMenu']} ${styles['shadow']} `}
              style={{ marginTop: '40%' }}
            >
              <div className={styles['tipdiv']}>
                <span
                  className={styles['tiptext']}
                  style={{ marginLeft: '80%', marginTop: '50%' }}
                >
                  Strehgth
                </span>
                <BsShadows
                  style={{ cursor: 'pointer' }}
                  onClick={() => showShadowMenu(setShowMenu2, showMenu2)}
                />
              </div>
            </div>
          ) : (
            <div
              className={`${styles['widthMenu']} ${styles['shadow']} `}
              style={{ marginTop: '40%' }}
            >
              <BsShadows
                onClick={() => showShadowMenu(setShowMenu2, showMenu2)}
                style={{
                  cursor: 'pointer',
                  filter:
                    activeTool === 'opacity'
                      ? 'drop-shadow(0px 0px 3px white)'
                      : 'none',
                }}
              />
              <div className={styles['shadowblock']}>
                <div className={styles['shadowblock1']}>
                  <span className={styles['min-text2']}>Strength</span>
                  <span className="StrehgthValue">({opacity})</span>
                </div>
                <div className={styles['shadowblock2']}>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step={'0.1'}
                    className={styles['shadow-input']}
                    value={opacity}
                    onChange={(event) => changeOpacity(event, setOpacity)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles['widthMenu']} sstyle={{ marginTop: '40%' }}>
            <div
              className={styles['tipdiv']}
              style={{ width: '100%', height: '100%', margin: 0 }}
            >
              <span className={styles['tiptext']}>Color Picker</span>
              <div className={styles['colorPicker']}>
                <input
                  onChange={(event) => ChangeCurCol(event, setCurCol)}
                  type="color"
                />
              </div>
            </div>
          </div>
        </div>
        <canvas
          onClick={(e) => {
            if (activeTool == 'bucket') {
              CanvasFillClick(e, canvas, ctx, pixelSize, CurCol)
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            if (activeTool == 'rectangle') {
              CanvasRectangleContextMenu(
                e,
                drawing,
                cancelled,
                overlayCtx,
                overlay,
                ctx,
                savedImage,
              )
            } else if (activeTool == 'circle') {
              CanvasEllipseContextMenu(
                e,
                overlay,
                ctx,
                overlayCtx,
                drawing,
                setCancelled,
                savedImage,
              )
            }
          }}
          onMouseDown={(e) => {
            saveState()
            clearOverlay(overlay, overlayCtx)
            setDrawing(true)
            if (activeTool == 'line') {
              CanvasLineOnMouseDown(
                e,
                overlay,
                overlayCtx,
                ctx,
                firstPoint,
                setFirstPoint,
                CurCol,
                pixelSize,
                pixelSizeModify,
              )
            } else if (activeTool == 'opacity') {
              drawPixel(
                e,
                e.target,
                ctx,
                hexToRgba(CurCol, opacity),
                pixelSize,
                false,
                1,
                pixelSizeModify,
              )
            } else if (activeTool == 'circle') {
              CanvasEllipseMouseDown(
                e,
                canvas,
                ctx,
                setStartX,
                setStartY,
                pixelSize,
                setDrawing,
                setCancelled,
                setSavedImage,
              )
            } else if (activeTool == 'rectangle') {
              CanvasRectangleMouseDown(
                e,
                canvas,
                ctx,
                pixelSize,
                setCancelled,
                setSavedImage,
                setStartX,
                setStartY,
              )
            } else if (activeTool == 'brush') {
              drawPixelWithNoise(
                e,
                e.target,
                ctx,
                CurCol,
                pixelSize,
                1,
                pixelSizeModify,
              )
            } else if (activeTool == 'pencil') {
              drawPixel(
                e,
                e.target,
                ctx,
                CurCol,
                pixelSize,
                false,
                1,
                pixelSizeModify,
              )
            } else if (activeTool == 'eraser') {
              drawPixel(
                e,
                e.target,
                ctx,
                CurCol,
                pixelSize,
                true,
                1,
                pixelSizeModify,
              )
            } else if (activeTool == 'spray') {
              drawSpray(e, e.target, ctx, CurCol, pixelSize, 1, pixelSizeModify)
            }
          }}
          onMouseMove={(e) => {
            if (activeTool == 'line') {
              CanvasLineOverlayOnMouseMove(
                e,
                firstPoint,
                overlay,
                overlayCtx,
                CurCol,
                pixelSize,
                pixelSizeModify,
              )
            } else if (!drawing) {
              clearOverlay(overlay, overlayCtx)
              if (activeTool == 'brush') {
                drawPixelWithNoise(
                  e,
                  e.target,
                  overlayCtx,
                  '#888888',
                  pixelSize,
                  0.5,
                  pixelSizeModify,
                )
              } else if (activeTool == 'pencil') {
                drawPixel(
                  e,
                  e.target,
                  overlayCtx,
                  '#888888',
                  pixelSize,
                  false,
                  0.5,
                  pixelSizeModify,
                )
              } else if (activeTool == 'eraser') {
                drawPixel(
                  e,
                  e.target,
                  overlayCtx,
                  '#888888',
                  pixelSize,
                  false,
                  0.5,
                  pixelSizeModify,
                )
              } else if (activeTool == 'spray') {
                drawPixel(
                  e,
                  e.target,
                  overlayCtx,
                  '#888888',
                  pixelSize,
                  false,
                  0.5,
                  pixelSizeModify,
                )
              } else if (activeTool == 'opacity') {
                drawPixel(
                  e,
                  e.target,
                  overlayCtx,
                  '#888888',
                  pixelSize,
                  false,
                  0.5,
                  pixelSizeModify,
                )
              }
            }
            if (drawing) {
              if (activeTool == 'brush') {
                drawPixelWithNoise(
                  e,
                  e.target,
                  ctx,
                  CurCol,
                  pixelSize,
                  1,
                  pixelSizeModify,
                )
              } else if (activeTool == 'circle') {
                CanvasEllipseMouseMove(
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
                )
              } else if (activeTool == 'rectangle') {
                CanvasRectangleMouseMove(
                  e,
                  drawing,
                  canvas,
                  overlay,
                  overlayCtx,
                  pixelSize,
                  startX,
                  startY,
                  shiftPressed,
                  CurCol,
                  fill,
                  pixelSizeModify,
                )
              } else if (activeTool == 'pencil') {
                drawPixel(
                  e,
                  e.target,
                  ctx,
                  CurCol,
                  pixelSize,
                  false,
                  1,
                  pixelSizeModify,
                )
              } else if (activeTool == 'eraser') {
                drawPixel(
                  e,
                  e.target,
                  ctx,
                  CurCol,
                  pixelSize,
                  true,
                  1,
                  pixelSizeModify,
                )
              } else if (activeTool == 'spray') {
                drawSpray(
                  e,
                  e.target,
                  ctx,
                  CurCol,
                  pixelSize,
                  1,
                  pixelSizeModify,
                )
              } else if (activeTool == 'opacity') {
                drawPixel(
                  e,
                  e.target,
                  ctx,
                  hexToRgba(CurCol, opacity),
                  pixelSize,
                  false,
                  opacity,
                  pixelSizeModify,
                )
              }
            }
          }}
          onMouseUp={(e) => {
            if (activeTool == 'rectangle') {
              CanvasRectangleMouseUp(
                e,
                drawing,
                canvas,
                ctx,
                overlay,
                overlayCtx,
                cancelled,
                pixelSize,
                startX,
                startY,
                shiftPressed,
                CurCol,
                fill,
                pixelSizeModify,
              )
            } else if (activeTool == 'circle') {
              CanvasEllipseMouseUp(
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
              )
            }
            setDrawing(false)
          }}
          onMouseLeave={() => {
            if (activeTool != 'rectangle' && activeTool != 'circle')
              clearOverlay(overlay, overlayCtx)
            setDrawing(false)
          }}
          id="draw"
          width={CanvasWidth}
          height={CanvasHeight}
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
            backgroundSize: `${pixelSize * 4}px ${pixelSize * 4}px`,
          }}
          ref={canvasRef}
          className={styles['canvasblock']}
        ></canvas>
        <canvas
          id="overlay"
          width={CanvasWidth}
          height={CanvasHeight}
          style={{ position: 'absolute', pointerEvents: 'none' }}
        ></canvas>
      </div>
      {showHelpBlock && (
        <div className={styles['helpBlock']}>
          <div className={styles['helpBlockContent']}>
            <h2 className={styles['h2tool']}>Tools Description</h2>
            <ul style={{ marginBottom: '20px' }}>
              <li>
                <strong>Pencil:</strong> Draw freehand lines.
              </li>
              <li>
                <strong>Eraser:</strong> Erase parts of your drawing.
              </li>
              <li>
                <strong>Brush:</strong> Paint with a brush tool.
              </li>
              <li>
                <strong>Line:</strong> Draw lines.
              </li>
              <li>
                <strong>Rectangle:</strong> Draw rectangles.
              </li>
              <li>
                <strong>Circle:</strong> Draw circles.
              </li>
              <li>
                <strong>Bucket:</strong> Fill areas with color.
              </li>
              <li>
                <strong>Shadows:</strong> Add shadow effects.
              </li>
              <li>
                <strong>Spray:</strong> Spray paint effect.
              </li>
            </ul>
            <h2 className={styles['h2tool']}>Tools Settings:</h2>
            <ul>
              <li>
                <strong>Pixel Size:</strong> Sets the size of the drawing tool.
              </li>
              <li>
                <strong>Figures Fill:</strong> Toggles the figure fill.
              </li>
              <li>
                <strong>Strength:</strong> Sets the strength of shadow tool.
              </li>
              <li>
                <strong>Color Picker:</strong> Sets current color.
              </li>
            </ul>
          </div>
        </div>
      )}
      {showClue ? (
        <div className={styles['help']}>
          <p>
            Do you want to clear your <br /> project?
          </p>
          <div className={styles['choose']}>
            <span onClick={clearField}>Yes</span>
            <span onClick={clue}>No</span>
          </div>
        </div>
      ) : (
        <div className={styles['none']}></div>
      )}
      {showInput ? (
        <div className={styles['cont']} style={{ zIndex: '100' }}>
          <input
            type="text"
            className={styles['settinginp']}
            value={inputValue}
            onChange={writeValue}
          />
          <button className={styles['settingbtn']} onClick={inputBtn}>
            Сохранить
          </button>
        </div>
      ) : (
        <div
          className={styles['cont']}
          style={{ zIndex: '-100', width: '0px', height: '0px' }}
        >
          <input type="text" className={styles['settinginp']} />
          <button className={styles['settingbtn']}>Сохранить</button>
        </div>
      )}
      {showSettings ? (
        <div className={styles['settingsWrapper']}>
          <div className={styles['settings']}>
            <div className={styles['mainSettings']}>
              <h2>Settings</h2>
              <span className={styles['spanSettings']} onClick={exportSettings}>
                Export
              </span>
              <span className={styles['spanSettings']} onClick={saveSettings}>
                Save project
              </span>
              <span
                className={styles['spanSettings']}
                onClick={projectSettings}
              >
                Project settings
              </span>
              <span className={styles['spanSettings']} onClick={keySettings}>
                Key bindings
              </span>
            </div>
            {showExport ? (
              <div className={styles['chosenSettings']}>
                <p>Export your project</p>
                <div className={styles['export']}>
                  Format:
                  <ul className={styles['format']}>
                    <li>
                      {' '}
                      {extension == 'png' ? (
                        <button
                          onClick={png}
                          style={{ border: '1px solid white' }}
                        >
                          PNG
                        </button>
                      ) : (
                        <button onClick={png}>PNG</button>
                      )}{' '}
                    </li>
                    <li> </li>
                    <li>
                      {' '}
                      {extension == 'jpg' ? (
                        <button
                          onClick={jpg}
                          style={{ border: '1px solid white' }}
                        >
                          JPG
                        </button>
                      ) : (
                        <button onClick={jpg}>JPG</button>
                      )}{' '}
                    </li>
                  </ul>
                  Resolution scale:
                  <ul className={styles['scale']}>
                    <li>
                      {' '}
                      Height{' '}
                      <input
                        type="number"
                        value={heightFordn}
                        onChange={hght}
                      />{' '}
                      px
                    </li>
                    <li>
                      {' '}
                      Width{' '}
                      <input
                        type="number"
                        value={widthFordn}
                        onChange={wdt}
                      />{' '}
                      px{' '}
                    </li>
                  </ul>
                  <div className={styles['saveDownload']}>
                    {extension == 'jpg' ? (
                      <button onClick={downloadImgJpg}>Download</button>
                    ) : (
                      <button onClick={downloadImg}>Download</button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            {showSaveSettings ? (
              <div className={styles['chosenSettings']}>
                <p>Save your project</p>
                <div className={styles['saveProject']}>
                  Name of your project:
                  <input
                    value={pictureName}
                    onChange={(event) => setPictureName(event.target.value)}
                    type="text"
                    maxlength="10"
                    className={styles['inputPictureName']}
                    placeholder="Picture name"
                  />
                  <div className={styles['checkboxDiv']}>
                    <span className={styles['checkboxText']}>
                      Send to the global gallery?
                    </span>
                    <input
                      onClick={() => checkboxPublicity(publicity, setPublicity)}
                      type="checkbox"
                      className={styles['checkboxSave']}
                    ></input>
                  </div>
                  <button
                    onClick={addPost}
                    className={styles['saveProjectBtn']}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
            {showProjectSettings ? (
              <div className={styles['chosenSettings']}>
                <p>Project Settings</p>
                <div className={styles['projectSettings']}>
                  Canvas resolution:
                  <ul className={styles['canvasScale']}>
                    <li>
                      {' '}
                      <span>Height</span>{' '}
                      <input
                        className="CanvasHeight"
                        type="number"
                        value={ChangedCanvasHeight}
                        onChange={(e) => {
                          setChangedCanvasHeight(e.target.value)
                        }}
                      />{' '}
                      <span>px</span>
                    </li>
                    <li className={styles['projectScale']}>
                      {' '}
                      Width
                      <input
                        className="CanvasWidth"
                        type="number"
                        value={ChangedCanvasWidth}
                        onChange={(e) => {
                          setChangedCanvasWidth(e.target.value)
                        }}
                      />{' '}
                      px{' '}
                    </li>
                  </ul>
                  <div className={styles['TracingDiv']}>
                    <span>
                      Use image as background for tracing?(It will not be saved)
                    </span>
                    <label style={{ cursor: 'pointer' }}>
                      Open
                      <input
                        type="file"
                        accept="image/jpeg"
                        style={{ rotate: '0deg', display: 'none' }}
                        className={styles['file-input']}
                        onChange={openJPG}
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      setCanvasHeight(
                        document.querySelector('.CanvasHeight').value,
                      )
                      setCanvasWidth(
                        document.querySelector('.CanvasWidth').value,
                      )
                    }}
                    className={styles['saveSettingsButton']}
                  >
                    <span>Save Settings</span>
                    <span>(Project settings will not be saved)</span>
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
            {showKeySettings ? (
              <div className={styles['chosenSettings']}>
                <p>Key Bindings</p>
                <div className={styles['tools']}>
                  <h2>Tools:</h2>
                  <ul>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('pencil')
                        }}
                      >
                        {defaultKeyBindings.pencil.toUpperCase()}
                      </span>{' '}
                      Pencil tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('eraser')
                        }}
                      >
                        {defaultKeyBindings.eraser.toUpperCase()}
                      </span>{' '}
                      Eraser tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('brush')
                        }}
                      >
                        {defaultKeyBindings.brush.toUpperCase()}
                      </span>{' '}
                      Brush tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('line')
                        }}
                      >
                        {defaultKeyBindings.line.toUpperCase()}
                      </span>{' '}
                      Line tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('rectangle')
                        }}
                      >
                        {defaultKeyBindings.rectangle.toUpperCase()}
                      </span>{' '}
                      Rect tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('circle')
                        }}
                      >
                        {defaultKeyBindings.circle.toUpperCase()}
                      </span>{' '}
                      Circle tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('bucket')
                        }}
                      >
                        {defaultKeyBindings.bucket.toUpperCase()}
                      </span>{' '}
                      Bucket tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('opacity')
                        }}
                      >
                        {defaultKeyBindings.opacity.toUpperCase()}
                      </span>{' '}
                      Shadows tool
                    </li>
                    <li>
                      {' '}
                      <span
                        className={styles['keys']}
                        onClick={() => {
                          showInputBtn()
                          setCurrentTool('spray')
                        }}
                      >
                        {defaultKeyBindings.spray.toUpperCase()}
                      </span>{' '}
                      Spray tool
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (
        <div className={styles['none']}></div>
      )}
      <div>
        <h1 className={styles['notavalible']}>Страница недоступна для данного разрешения экрана</h1>
      </div>
    </div>
  )
}
