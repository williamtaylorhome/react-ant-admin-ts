import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./index.less"

export type CloseType = "all" | "right" | "left" | "current"

interface ContextMenuProps {
  isCurrent: boolean
  visible: boolean
  x: number
  y: number
  setVisible: (v: boolean) => void
  onClose: (t: CloseType) => void
}

const onContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
  e.stopPropagation()
  e.preventDefault()
}


export default function ContextMenu({ isCurrent, visible, x, y, setVisible, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLUListElement>(null)
  const [style, setStyle] = useState({})

  const display = useMemo(() => {
    if (visible) {
      return "block"
    }
    return "none"
  }, [visible])

  const visibility = useMemo(() => {
    if (visible) {
      document.body.style.overflow = "hidden"
      return "visible"
    }
    document.body.style.overflow = "unset"
    return "hidden"
  }, [visible])

  useEffect(() => {
    const wwidth = window.screen.availWidth || document.body.offsetWidth
    const width = ref.current?.offsetWidth || 0
    let left = x, top = y;
    if (x + width > wwidth) {
      left = x - width
    }
    const newStyle = { left, top, visibility }
    setStyle(newStyle)
  }, [x, y, visibility, ref])
  // Close the menu
  const closeMenu = useCallback(() => {
    if (visibility === "visible") {
      console.log("Close the pop-up window");
      setVisible(false)
    }
    return false
  }, [setVisible, visibility])

  // Turn off all options
  const closeAll = useCallback((e) => {
    e.stopPropagation()
    console.log("Close all");
    onClose("all")
    closeMenu()
  }, [closeMenu, onClose])

  // Close the Right Side option
  const closeRight = useCallback((e) => {
    e.stopPropagation()
    console.log("right");
    onClose("right")
    closeMenu()
  }, [closeMenu, onClose])

  // Close the Left side option
  const closeLeft = useCallback((e) => {
    e.stopPropagation()
    console.log("left");
    onClose("left")
    closeMenu()
  }, [closeMenu, onClose])

  // Close the current option
  const closeCurrent = useCallback((e) => {
    e.stopPropagation()
    console.log("current");
    onClose("current")
    closeMenu()
  }, [closeMenu, onClose])

  return <div
    onContextMenu={onContextMenu}
    onMouseUp={closeMenu}
    style={{ display }}
    className="centext-menu"
  >
    <ul style={style} ref={ref}>
      <li onMouseUp={closeAll}>close All</li>
      <li onMouseUp={closeRight}>close Right</li>
      <li onMouseUp={closeLeft}>close Left</li>
      {
        isCurrent && <li onMouseUp={closeCurrent}>close Current</li>
      }
    </ul>
  </div>
}