import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  geneAlignment as requestGeneAlignment
} from '../indexQuerying/geneQuery'
import KeyVals from '../common/KeyVals.js'
import Table from '../common/Table.js'
import Spinner from 'react-bootstrap/Spinner'

const acidColors = {
  A: '#f77',
  T: '#77f',
  G: '#7f7',
  C: '#ff7',
  N: '#888888'
}

const mutedAcidColors = {
  A: '#fff8f8',
  T: '#f8f8ff',
  G: '#f8fff8',
  C: '#fffff8',
  N: '#888888'
}

const LoadBox = ({ value, children, ...props }) => (
  <div {...props}>
    {
      value
        ? children(value)
        : (
          <div
            style={{
              color: '#aaa'
            }}
          >
            Loading...
          </div>
          )
    }
  </div>
)

const GeneTable = ({ data, scale, differences }) => {
  const fontHeight = 20
  const fontWidth = 15

  const dataRows = useMemo(() => {
    const dataRows = Object.entries(data).sort(([rawKeyA], [rawKeyB]) => (
      rawKeyA > rawKeyB ? 1 : rawKeyA < rawKeyB ? -1 : 0
    ))
    if (!dataRows.length) return []

    const leadRow = dataRows[0][1].split('')

    return dataRows.map(([rawKey, sequence]) => {
      const label = rawKey.split(';')[0]
      const smallLabel = label.substring(
        0,
        label.indexOf(
          '_',
          label.indexOf('.')
        )
      ) || label

      const diffChars = sequence.split('').map((a, index) => a !== leadRow[index])

      // To speed up performance, group like-acids together
      const segments = []
      sequence.split('').forEach((a, index) => {
        const lastSegment = segments[segments.length - 1]
        const lastChar = lastSegment?.[0] || null
        if ((!diffChars[index - 1] === !diffChars[index]) && lastChar === a) {
          segments[segments.length - 1] += a
        } else {
          segments.push(a)
        }
      })

      return [smallLabel, ...segments]
    })
  }, [data])

  const draw = useCallback(({
    beforeLabelRender = () => {},
    beforeSegmentRender = () => {}
  }) => {
    if (!dataRows || !dataRows.length) {
      return null
    }
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const longestLabel = dataRows.reduce((total, row) => Math.max(total, row[0].length), 0)

    const canvasWidth = dataRows.reduce(
      (total, row) => Math.max(total, row.reduce(
        (total, segments) => total + segments.length,
        0
      )),
      0
    ) * fontWidth
    const canvasHeight = dataRows.length * fontHeight

    canvas.width = canvasWidth + fontWidth * 2
    canvas.height = canvasHeight + 2
    context.font = `${fontHeight}px monospace`

    const rowToString = (row) => row
      .reduce(
        (array, segment, index) => array.concat(
          index
            ? segment
            : segment.padStart(longestLabel, ' ')
        ),
        []
      )
      .join('')

    const leadRow = rowToString(dataRows[0])

    dataRows.forEach((row, rowIndex) => {
      context.translate(0, fontHeight)
      context.save()
      const rowDifferent = rowIndex !== 0 && (
        leadRow.substring(longestLabel, leadRow.length) !==
        rowToString(row).substring(longestLabel, leadRow.length)
      )
      row.reduce((currentIndex, segment, index) => {
        if (index === 0) {
          context.save()
          context.translate(-1, -fontHeight + 2)
          beforeLabelRender({
            context,
            text: segment,
            width: longestLabel * fontWidth,
            height: fontHeight,
            different: rowDifferent
          })
          context.restore()
          context.fillText(segment, (longestLabel - segment.length) * fontWidth, 0)
        } else {
          context.save()
          context.translate(-1, -fontHeight + 1)
          beforeSegmentRender({
            context,
            text: segment,
            width: segment.length * fontWidth,
            height: fontHeight,
            different: rowDifferent && leadRow[currentIndex] !== segment[0]
          })
          context.restore()
          segment.split('').forEach((character, index) => {
            context.fillText(character, index * fontWidth, 0)
          })
        }

        const indexOffset = (index ? segment.length : longestLabel)
        context.translate(fontWidth * indexOffset, 0)
        return currentIndex + indexOffset
      }, 0)
      context.restore()
    })

    const data = canvas.toDataURL('image/png')
    return data
  }, [dataRows])

  console.log(dataRows)

  const baseImage = useMemo(() => draw({
    beforeSegmentRender: ({ context, text, width, height }) => {
      context.fillStyle = acidColors[text?.[0]] || acidColors.N
      context.fillRect(0, 0, width, height)
    }
  }), [draw])

  const differencesImage = useMemo(() => draw({
    beforeLabelRender: ({ context, different, width, height }) => {
      if (different) {
        context.fillStyle = '#ccc'
        context.fillRect(0, 0, width, height)
      }
    },
    beforeSegmentRender: ({ context, different, text, width, height }) => {
      if (different) {
        context.fillStyle = acidColors[text?.[0]] || acidColors.N
        context.strokeStyle = '#000'
        context.lineWidth = 1
      } else {
        context.fillStyle = mutedAcidColors[text?.[0]] || acidColors.N
      }
      context.fillRect(0, 0, width, height)
      if (different) {
        context.strokeRect(0, 0, width, height)
      }
    }
  }), [draw])
  return (
    <div
      style={{
        maxWidth: 'calc(100vw - 50px)',
        overflow: 'auto',
        height: `${Math.min(
          500,
          fontHeight * dataRows.length * scale / 120
        )}px`
      }}
    >
      <img
        src={differences ? differencesImage : baseImage}
        alt={differences ? 'Gene difference representation' : 'Gene representation'}
        style={{
          transformOrigin: '0 0',
          transform: `scale(${scale / 120}, ${scale / 120})`,
          height: `${Math.min(
            fontHeight * dataRows.length * scale / 120
          )}px`
        }}
      />
    </div>
  )
}

const GeneVisualizer = ({ data }) => {
  const [scale, setScale] = useState(100)
  const [differences, setDifferences] = useState(false)

  const renderedTable = useMemo(() => (
    <GeneTable data={data} scale={scale} differences={differences} />
  ), [data, scale, differences])

  if (!data) {
    return null
  }

  return (
    <div>
      <div className='d-flex w-100'>
        <label className='m-2'>
          <span className='m-2'>Scale:</span>
          <input
            className='flex'
            type='range'
            min={20}
            max={100}
            value={scale}
            onChange={(e) => setScale(e.target.value)}
          />
        </label>
        <label className='m-2'>
          <span className='m-2'>Only show differences</span>
          <input
            type='checkbox'
            value={differences}
            onChange={e => {
              setDifferences(e.target.checked)
            }}
          />
        </label>
      </div>

      {renderedTable}
    </div>
  )
}

const MainWrapper = ({ children }) => (
  <div style={{ padding: 0 }} className='d-flex flex-column container text-left text-start h-100 position-absolute'>
    <div className='container'>
      <h1>Identified Genes</h1>
    </div>
    <div
      className='d-flex flex-fill position-relative overflow-auto px-4'
    >
      <div className='flex-fill d-flex flex-column'>
        {children}
      </div>
    </div>
  </div>
)

const GeneMetadataTable = ({ geneInfo }) => (
  <Table
    columns={[
      {
        title: 'Biosample accession',
        name: 'bioSample'
      },
      {
        title: 'Species',
        name: 'organismName'
      },
      {
        title: 'Country',
        name: 'country'
      },
      {
        title: 'Year',
        name: 'year'
      },
      {
        title: 'Number of contigs',
        name: 'contigStats'
      },
      {
        title: 'Download links',
        name: 'sequenceURL'
      }
    ]}
    rows={
      (geneInfo?.geneMetadata.isolateMetadata || []).map(({
        BioSample: bioSample,
        Organism_name: organismName,
        Country: country,
        Year: year,
        contig_stats: { sequence_count: contigStats },
        sequenceURL
      }) => ({
        bioSample: (
          <Link
            to={`/isolate/streptococcus/pneumoniae/${bioSample}`}
            target='_blank'
          >
            {bioSample}
          </Link>
        ),
        organismName,
        country,
        year,
        contigStats,
        sequenceURL: (
          (
            sequenceURL instanceof Array
              ? sequenceURL
              : [sequenceURL]
          ).map((link, index, array) => (
            <a
              key={link}
              href={link}
              rel='noreferrer'
              title={link.split('/')[link.split('/').length - 1]}
            >
              {
                index < array.length - 1 || array.length === 2
                  ? `read_${index + 1}`
                  : 'assembly'
              }
            </a>
          ))
        )
      }))
    }
  />
)

const GeneDisplay = ({ geneInfo, noResults }) => {
  const [geneAlignment, setGeneAlignment] = useState({})
  const displayNames = useMemo(() => (
    geneInfo && geneInfo.panarooNames.split('~~~').filter(name => !['UNNAMED', 'PRED_'].includes(name))
  ), [geneInfo])

  const consistentName = geneInfo?.consistentNames
  useEffect(() => {
    if (consistentName) {
      requestGeneAlignment(consistentName).then(alignment => {
        setGeneAlignment(alignment)
      })
    }
  }, [consistentName, setGeneAlignment])

  return (
    <MainWrapper>
      {
        noResults
          ? (
            <div>There are no results for this gene.</div>
            )
          : (
            <>
              <h4>Annotation assigned by Panaroo</h4>
              <LoadBox value={displayNames}>
                {() => (
                  <KeyVals items={[
                    ['Names/Aliases', displayNames.join(', ')],
                    // ['Gene frequency', `${((queryResult.length / 26616) * 100).toFixed(2)}%`]
                    ['Gene frequency', `${((geneInfo?.geneMetadata.isolateMetadata.length / 26616) * 100).toFixed(2)}%`]
                  ]}
                  />
                )}
              </LoadBox>
              <div className='my-4'>
                Gene was found in {
                  // queryResult.length
                  geneInfo?.geneMetadata.isolateMetadata.length
                } isolates

              </div>

              <div className='mt-4'>
                <h6>Description(s):</h6>
                <LoadBox value={geneInfo?.panarooDescriptions} className='mb-4'>
                  {(panarooDescriptions) => (
                    <ul key='ul'>
                      {
                      panarooDescriptions.map((item) => (
                        <li key={item}>{item}</li>
                      ))
                    }
                    </ul>
                  )}
                </LoadBox>

              </div>

              {
              geneInfo?.pfam_names && (
                <div className='mt-4'>
                  <h6>Annotation assigned by Pfam:</h6>
                  <KeyVals
                    items={[
                      ['Names/Aliases', geneInfo.pfam_names],
                      ['Description(s)', geneInfo.pfam_descriptions],
                      ['Accession(s)', geneInfo.pfam_accessions],
                      ['E-value(s)', geneInfo.pfam_evalues]
                    ]}
                  />
                  <ul key='ul'>
                    {
                      geneInfo.panarooDescriptions.map((item) => (
                        <li key={item}>{item}</li>
                      ))
                    }
                  </ul>
                </div>
              )
            }
              <LoadBox value={geneAlignment} className='mt-4'>
                {(genes) => (
                  <GeneVisualizer data={genes} />
                )}
              </LoadBox>
              {
                Object.keys(geneAlignment).length
                  ? (
                    <GeneMetadataTable {...{ geneInfo }} />
                    )
                  : (
                    <div className='d-flex align-items-center justify-content-center'>
                      <Spinner
                        className='search-spinner'
                        animation='border'
                        variant='primary'
                      />
                    </div>
                    )
              }
              <div style={{ minHeight: '3rem' }} />
            </>
            )
      }
    </MainWrapper>
  )
}

export default GeneDisplay
