import { useState } from "react"
import { colors } from "../utils/const"

export default function Memo() {
  const [active, setActive] = useState(false)

  return (
    <div className={"memo" + (active ? ' active' : '')} onClick={() => setActive(prev => !prev)}>
      {colors.map((color, i) => (
        <div className="color" key={i} style={{ backgroundColor: color.hue }}>{active ? color.rule : ''}</div>
      ))}
    </div>
  )
}