import React, { useEffect, useRef, useState } from 'react'

const Canvas = ({ style, render }) => {
  const canvasRef = useRef()
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  })
  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    let isRendering = false
    const update = ({ context, width, height }) => {
      render({ canvas: canvasRef.current, context, width, height })
    }
    const prepRerender = () => {
      if (isRendering) return
      isRendering = true
      window.requestAnimationFrame(() => {
        isRendering = false

        const canvas = canvasRef.current
        if (!canvas) {
          return
        }
        const context = canvas.getContext('2d')

        const { width: rawWidth, height } = canvas.parentNode.getBoundingClientRect()
        const width = rawWidth

        const ratio = window.devicePixelRatio || 1

        canvas.width = ratio * width
        canvas.height = ratio * height
        context.scale(ratio, ratio)
        if (dimensions.width && dimensions.height) {
          update({ context, width, height })
        }

        // Recalc the width AFTER render
        const { width: widthAfter, height: heightAfter } = canvas.parentNode.getBoundingClientRect()
        if (dimensions.width !== widthAfter || dimensions.height !== heightAfter) {
          setDimensions({
            width: widthAfter,
            height: heightAfter
          })
        }
      })
    }
    prepRerender()
    window.addEventListener('resize', prepRerender, true)
    return () => window.removeEventListener('resize', prepRerender, true)
  }, [dimensions, setDimensions, render])

  return <canvas style={style} ref={canvasRef} className='w-100 h-100' />
}

export default Canvas
