import React from 'react'
import ColorHash from 'color-hash'

const colorHash = new ColorHash()

const graphHeight = 500

const StackedBar = ({ ratioScale, data }) => {
  const total = data.reduce((total, { amount }) => total + amount, 0)
  return (
    <div
      style={{
        position: 'relative',
        height: `${graphHeight}px`
      }}
    >
      {
        data.map(({ label, amount }) => {
          return (
            <div
              key={label}
              style={{
                overflow: 'hidden',
                height: `${
                  ((amount / total) * (100 - ratioScale)) +
                  ((1 / data.length) * ratioScale)
                }%`,
                backgroundColor: colorHash.hex(label)
              }}
            >
              {label}
            </div>
          )
        })
      }
    </div>
  )
}

export default StackedBar
