import React, { useCallback, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Canvas from './Canvas.js'

const Histogram = ({
  xAxisLabel,
  yAxisLabel,
  active,
  scale,
  data,
  labels,
  min,
  max,
  ...props
}) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  })
  const yAxisMargin = 80
  const rowCount = Math.floor(dimensions.height / 20)

  const minNum = +`${min}`.replace(/,/g, '')
  const maxNum = +`${max}`.replace(/,/g, '')

  const render = useCallback(({ context, width, height }) => {
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height })
    }
    context.save()
    const barWidth = width / data.length
    const total = data.reduce((total, n) => Math.max(total, n), 0)

    context.fillStyle = '#aaa'
    context.fillRect(0, 0, width, height)

    context.font = `${barWidth / 1.3}px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`

    data.forEach((n, index) => {
      context.fillStyle = '#888'
      context.fillRect(index * barWidth, 0, 1, height)

      if (active?.[index]) {
        context.fillStyle = '#fcc'
        context.fillRect(
          Math.floor(index * barWidth),
          0,
          Math.ceil(barWidth),
          height
        )
        context.fillStyle = '#f00'
      } else {
        context.fillStyle = '#88b'
      }
      context.fillRect(
        Math.floor(index * barWidth),
        (height - ((n / total) * height * scale)),
        Math.ceil(barWidth),
        height * scale
      )

      if (labels && labels[index]) {
        context.save()
        context.fillStyle = 'rgba(0,0,0,0.6)'
        context.translate(Math.floor((index + 1) * barWidth) - 5, height - 10)
        context.rotate(270 * Math.PI / 180)
        context.fillText(n.toLocaleString('en-US'), 0, 0)
        context.restore()
      }
    })

    context.restore()
  }, [active, scale, data, labels, dimensions, setDimensions])

  // Spinner
  return (data.length)
    ? (
      <div className='d-flex flex-column overflow-hidden position-relative' {...props}>
        <h6
          className='position-absolute'
          style={{
            transform: 'rotate(270deg)',
            transformOrigin: `${dimensions.height / 2}px ${dimensions.height / 2}px`,
            width: `${dimensions.height}px`,
            top: '20px'
          }}
        >
          {yAxisLabel}
        </h6>
        <h6
          style={{
            marginLeft: `${yAxisMargin}px`,
            marginBottom: '2px'
          }}
        >
          {xAxisLabel}
        </h6>
        <div
          className='flex-fill overflow-hidden'
          style={{
            marginLeft: `${yAxisMargin}px`,
            marginRight: '48px'
          }}
        >
          <Canvas render={render} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            fontSize: '14px',
            height: `${dimensions.height}px`,
            justifyContent: 'space-between',
            left: '24px',
            lineHeight: '0',
            position: 'absolute',
            textAlign: 'right',
            top: '21px',
            width: `${yAxisMargin - 28}px`
          }}
        >
          {
            Array.from(Array(rowCount)).map((_, index) => (
              <div key={`${xAxisLabel}-${index}`}>
                {Math.round(minNum + (maxNum - minNum) * (index / (rowCount - 1))).toLocaleString('en-US')}
              </div>
            ))
          }
        </div>
        {labels && (
          <div
            className='position-relative'
            style={{
              height: '100px',
              marginLeft: `${yAxisMargin}px`
            }}
          >
            {
              labels.map((label, index) => (
                <div
                  key={`${label}-${index}`}
                  style={{
                    position: 'absolute',
                    width: '100px',
                    textAlign: 'right',
                    left: `${-48 + (index / labels.length * dimensions.width)}px`,
                    top: '85px',
                    transform: 'rotate(300deg)',
                    transformOrigin: '0% 0%',
                    fontSize: `${Math.max(12, dimensions.width / 2 / labels.length)}px`
                  }}
                >
                  {
                    label
                  }
                </div>
              ))
            }
          </div>
        )}
      </div>
      )
    : (
      <div className='w-100 d-flex justify-content-center'>
        <Spinner animation='border' variant='primary' />
      </div>
      )
}

export default Histogram
