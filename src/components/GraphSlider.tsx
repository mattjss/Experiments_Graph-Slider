import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function GraphSlider() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0.5) // 0 to 1, representing position across the graph
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimated(true)
  }, [])

  // Convert slider position (0-1) to time of day (0-24 hours)
  const getTimeFromPosition = (position: number): string => {
    const hours = Math.floor(position * 24)
    const minutes = Math.floor((position * 24 - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updatePosition(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updatePosition(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const artboardSize = 500
  const graphSize = 200
  const translateX = (artboardSize - graphSize) / 2  // (500 - 200) / 2 = 150
  const translateY = (artboardSize - graphSize) / 2  // (500 - 200) / 2 = 150

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const graphLeft = rect.left + translateX
    const graphRight = graphLeft + graphSize
    const clampedX = Math.max(graphLeft, Math.min(graphRight, clientX))
    const position = (clampedX - graphLeft) / graphSize
    setSliderPosition(Math.max(0, Math.min(1, position)))
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, translateX, graphSize])
  
  // SVG path from test_graph3.svg
  // Original viewBox: 0 0 201 200
  const svgPath = "M0 134.969H7.2956L12.327 129.183L21.8868 138.491H31.9497L36.478 134.969L42.5157 141.007L57.3585 128.428L63.6478 134.214L70.4403 125.661L80.5031 123.145L84.5283 110.566L92.0755 107.548L95.8491 101.51L103.899 114.34L115.22 110.566L122.516 85.6608L130.063 86.9187L135.597 76.8558L140.881 79.3715L143.145 76.8558L150.943 85.6608L158.994 63.0193L168.302 67.0445L177.107 58.9941H188.176L192.956 72.8306L200 64.0256"
  
  // Original SVG dimensions
  const originalWidth = 201
  const originalHeight = 200
  
  // Scale to fit exactly 200x200px (graph size)
  // Use uniform scale to maintain aspect ratio
  const scaleX = graphSize / originalWidth  // 200 / 201 ≈ 0.995
  const scaleY = graphSize / originalHeight // 200 / 200 = 1
  const scale = Math.min(scaleX, scaleY) // Use 0.995 to maintain aspect ratio

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#191919' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Artboard Container - exactly 500x500px square */}
        <div
          ref={containerRef}
          className="relative"
          style={{ 
            width: `${artboardSize}px`, 
            height: `${artboardSize}px`, 
            backgroundColor: '#191919',
            aspectRatio: '1 / 1',
            flexShrink: 0,
            boxSizing: 'border-box',
            overflow: 'visible'
          }}
        >
          {/* Chart SVG */}
          <svg
            width={artboardSize}
            height={artboardSize}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${artboardSize} ${artboardSize}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: 'block' }}
          >
            {/* SVG Path with transform - 200x200px graph centered in 500x500px artboard */}
            <g transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
              <motion.path
                d={svgPath}
                fill="none"
                stroke="#2B6491"
                strokeWidth="1.50943"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: isAnimated ? 1 : 0,
                  opacity: isAnimated ? 1 : 0,
                }}
                transition={{
                  pathLength: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.6 },
                }}
                style={{ 
                  transformOrigin: 'center',
                }}
              />
            </g>
          </svg>

          {/* Time Indicator Line - 224px tall, draggable */}
          <div
            ref={sliderRef}
            className="absolute cursor-grab active:cursor-grabbing select-none"
            style={{
              left: `${translateX + sliderPosition * graphSize}px`,
              top: `${translateY + graphSize - 224}px`, // Position so bottom touches graph bottom
              width: '1px',
              height: '224px',
              transform: 'translateX(-0.5px)', // Center the 1px line
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Vertical Line */}
            <div
              className="absolute w-full h-full"
              style={{
                backgroundColor: '#282828',
              }}
            />

            {/* Time Pill - above the line */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
              style={{
                marginBottom: '8px',
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="rounded-full"
                style={{
                  backgroundColor: '#282828',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 400,
                  padding: '2px 6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {getTimeFromPosition(sliderPosition)}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
