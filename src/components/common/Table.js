import { useEffect, useMemo, useRef, useState } from 'react'
import { isIdentical } from '../../utils.js'

const defaultRowHeight = 27

const Table = (props) => {
  const tableRef = useRef()
  const [propState, setPropState] = useState(props)
  const rowHeight = propState.rowHeight || defaultRowHeight
  const rowLength = propState.rows.length

  // To be designed
  const [visibleRange, setVisibleRange] = useState({
    min: 0,
    max: Infinity
  })

  const rendered = useMemo(() => {
    const {
      columns,
      rows
    } = propState
    return (
      <table ref={tableRef}>
        <thead>
          <tr className='align-top'>
            {
              columns.map(({ title, name }) => (
                <th
                  key={`column-${name}`}
                  className='bg-white sticky-top'
                  style={{
                    marginLeft: '1px',
                    boxShadow: 'inset 0 0 0 1px #dee2e6'
                  }}
                >
                  {title}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          <tr
            key='top-padding'
            style={{
              height: `${rowHeight * visibleRange.min}px`
            }}
          />
          {
            rows.filter((_, index) => (
              (visibleRange.min <= index && index < visibleRange.max)
            )).map((row, index) => (
              <tr
                key={index + visibleRange.min}
                className={index % 2 ? '' : 'bg-light'}
                style={{
                  height: `${rowHeight}px`
                }}
              >
                {
                  columns.map(({ name }) => (
                    <td
                      key={`row-${index}-${name}`}
                      className='border'
                    >
                      {row[name]}
                    </td>
                  ))
                }
              </tr>
            ))
        }
          <tr
            key='bottom-padding'
            style={{
              height: `${rowHeight * (rows.length - visibleRange.max)}px`
            }}
          />
        </tbody>
      </table>
    )
  }, [rowHeight, propState, visibleRange])

  useEffect(() => {
    let animationFrame
    const onScroll = () => {
      if (animationFrame) {
        return
      }
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null
        const tableYOffset = tableRef.current.getBoundingClientRect().y

        const maxRows = Math.ceil(window.innerHeight / rowHeight * 3)

        const min = Math.min(
          rowLength - maxRows,
          Math.floor(Math.max(0, -Math.round(tableYOffset / rowHeight)) / 2) * 2
        )
        const max = min + maxRows
        // const max = Math.max(1000, -tableYOffset + window.innerHeight + 500)

        if (min !== visibleRange.min || max !== visibleRange.max) {
          console.log('min: ', min, 'max: ', max)
          setVisibleRange({ min, max })
        }
      })
    }

    // onScroll()
    const events = [
      'scroll',
      'wheel',
      'resize'
    ]
    events.forEach(event => {
      window.addEventListener(event, onScroll, true)
    })
    return () => {
      window.cancelAnimationFrame(animationFrame)
      events.forEach(event => {
        window.removeEventListener(event, onScroll, true)
      })
    }
  }, [rowLength, rowHeight, visibleRange, setVisibleRange])

  useEffect(() => {
    if (!isIdentical(props, propState)) {
      setPropState(props)
    }
  }, [props, propState, setPropState])

  return rendered
}

export default Table
