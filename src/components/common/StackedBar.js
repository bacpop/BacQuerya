import React, { useCallback, useEffect, useState } from 'react'
import ColorHash from 'color-hash'
import xss from 'xss'
import Canvas from './Canvas.js'

const colorHash = new ColorHash()

const graphHeight = 500
const labelHeight = 27

const StackedBar = ({ ratioScale, data }) => {
  const [yCoords, setYCoords] = useState([])
  const total = data.reduce((total, { amount }) => total + amount, 0)
  const render = useCallback(({ context, width }) => {
    yCoords.forEach(([y1, y2, color]) => {
      context.save()
      context.strokeStyle = color
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(0, y1)
      context.lineTo(width, y2)
      context.closePath()
      context.stroke()
      context.restore()
    })
  }, [yCoords])

  const getPercentHeight = useCallback(({ amount }) => (
    ((amount / total) * (100 - ratioScale)) +
    ((1 / data.length) * ratioScale)
  ), [total, ratioScale, data.length])

  const getCurrentTop = useCallback(({ index }) => (
    data.reduce((sum, { amount }, topIndex) => {
      const percent = (
        ((amount / total) * (100 - ratioScale)) +
        ((1 / data.length) * ratioScale)
      )
      return topIndex < index
        ? sum + (percent / 100 * graphHeight)
        : sum
    }, 0)
  ), [data, ratioScale, total])

  const getCurrentTopInRange = useCallback(({ index }) => (
    Math.max(
      index * labelHeight - labelHeight,
      Math.min(
        graphHeight - ((data.length - index) * labelHeight),
        getCurrentTop({ index })
      )
    )
  ), [getCurrentTop, data.length])

  useEffect(() => {
    setYCoords(
      data.reduce((array, { amount, label }, index) => {
        return array.concat([[
          getCurrentTop({ index }) +
          (getPercentHeight({ amount }) / 200) * graphHeight,
          getCurrentTopInRange({ index }) + labelHeight / 2,
          colorHash.hex(label)
        ]])
      }, [])
    )
  }, [setYCoords, getPercentHeight, getCurrentTop, getCurrentTopInRange, data])

  return (
    <div
      style={{
        position: 'relative',
        height: `${graphHeight}px`,
        width: '100%'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '32px',
          maxWidth: `${100 - 32}px`,
          width: `${100 - 32}px`,
          height: '500px'
        }}
      >
        <Canvas
          render={render}
        />
      </div>

      {
        data.map(({ label, amount }, index) => {
          const percent = getPercentHeight({ amount })
          return (
            <React.Fragment key={label}>
              <div
                style={{
                  overflow: 'hidden',
                  width: '32px',
                  height: `${percent}%`,
                  backgroundColor: colorHash.hex(label),
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.4)'
                }}
              />
              <div
                style={{
                  overflow: 'hidden',
                  position: 'absolute',
                  pointerEvents: 'none',
                  left: '100px',
                  top: `${getCurrentTopInRange({ index })
                  }px`
                }}
                dangerouslySetInnerHTML={{
                  __html: xss(label)
                }}
              />
            </React.Fragment>
          )
        })
      }
    </div>
  )
}

export default StackedBar
