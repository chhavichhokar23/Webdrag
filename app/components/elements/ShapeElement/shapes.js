export function RectangleSVG({ color, borderColor, borderWidth, borderRadius }) {
  const half = borderWidth / 2
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect
        x={half}
        y={half}
        width={100 - borderWidth}
        height={100 - borderWidth}
        rx={borderRadius}
        ry={borderRadius}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
    </svg>
  )
}

export function CircleSVG({ color, borderColor, borderWidth }) {
  const r = 50 - borderWidth / 2
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <circle
        cx={50}
        cy={50}
        r={r}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
    </svg>
  )
}

export function TriangleSVG({ color, borderColor, borderWidth }) {
  const pad = borderWidth
  const points = `50,${pad} ${100 - pad},${100 - pad} ${pad},${100 - pad}`
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <polygon
        points={points}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DiamondSVG({ color, borderColor, borderWidth }) {
  const pad = borderWidth
  const points = `50,${pad} ${100 - pad},50 50,${100 - pad} ${pad},50`
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <polygon
        points={points}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarSVG({ color, borderColor, borderWidth }) {
  const outerR = 50 - borderWidth
  const innerR = outerR * 0.4
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`
  }).join(" ")
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <polygon
        points={points}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PentagonSVG({ color, borderColor, borderWidth }) {
  const r = 50 - borderWidth
  const points = Array.from({ length: 5 }, (_, i) => {
    const angle = (2 * Math.PI / 5) * i - Math.PI / 2
    return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`
  }).join(" ")
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <polygon
        points={points}
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const shapeList = [
  { name: "rectangle", label: "Rectangle", component: RectangleSVG },
  { name: "circle",    label: "Circle",    component: CircleSVG    },
  { name: "triangle",  label: "Triangle",  component: TriangleSVG  },
  { name: "diamond",   label: "Diamond",   component: DiamondSVG   },
  { name: "star",      label: "Star",      component: StarSVG      },
  { name: "pentagon",  label: "Pentagon",  component: PentagonSVG  },
]
