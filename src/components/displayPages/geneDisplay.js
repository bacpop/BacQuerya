import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  specificIsolateQuery
} from '../indexQuerying/isolateQuery'
import {
  geneAlignment as requestGeneAlignment
} from '../indexQuerying/geneQuery'
import '../../CSS/geneDisplay.css'
import KeyVals from '../common/KeyVals.js'

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

// May replace with classes
const GeneTable = ({ data, scale, differences }) => {
  if (!data) return null
  const validAcids = ['A', 'T', 'C', 'G']

  const dataRows = Object.entries(data).sort(([rawKeyA], [rawKeyB]) => (
    rawKeyA > rawKeyB ? 1 : rawKeyA < rawKeyB ? -1 : 0
  ))
  if (!dataRows.length) return null

  const leadRow = dataRows[0][1].split('')
  console.log(leadRow)

  return (
    <div
      style={{
        minHeight: '115px',
        overflow: 'scroll',
        fontSize: scale / 7.1
      }}
    >
      <table cellPadding='0' cellSpacing='0' className={`gene-table${differences ? ' differences' : ''}`}>
        <tbody>
          {
            dataRows.map(([rawKey, sequence]) => {
              const label = rawKey.split(';')[0]
              const smallLabel = label.substring(
                0,
                label.indexOf(
                  '_',
                  label.indexOf('.')
                )
              )

              const diffChars = differences
                ? sequence.split('').map((a, index) => a !== leadRow[index])
                : sequence.split('').map(_ => 0)

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

              let actualIndex = 0
              return (
                <tr
                  key={rawKey}
                  style={{
                    padding: 0,
                    margin: 0
                  }}
                >
                  <td
                    className={`text-end text-right pr-2${diffChars.some(c => c) ? ' row-different' : ''}`}
                    style={{
                      padding: 0,
                      margin: 0
                    }}
                  >
                    {smallLabel || label || rawKey}:
                  </td>
                  <td
                    className='text-monospace'
                    style={{
                      letterSpacing: '3px',
                      padding: 0,
                      margin: 0,
                      fontSize: '127%',
                      lineHeight: '0'
                    }}
                  >
                    {segments.map((str, index) => {
                      const thisActualIndex = actualIndex
                      actualIndex += str.length
                      let acid = str[0]
                      acid = validAcids.includes(acid) ? acid : 'N'
                      return (
                        <span
                          className={`acid-${acid}${diffChars[thisActualIndex] ? ' different' : ''}`}
                          key={`${rawKey}-${index}`}
                        >
                          {str}
                        </span>
                      )
                    })}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

const GeneVisualizer = ({ data }) => {
  const [scale, setScale] = useState(100)
  const [debouncedScale, setDebouncedScale] = useState(scale)
  const [differences, setDifferences] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedScale(scale)
    }, 300)
    return () => {
      clearTimeout(timeout)
    }
  }, [scale, setDebouncedScale])

  const renderedTable = useMemo(() => (
    <GeneTable data={data} scale={debouncedScale} differences={differences} />
  ), [data, debouncedScale, differences])

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
          <span className='m-2'>Differences</span>
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
  <div className='d-flex flex-column container text-left text-start h-100 position-absolute'>
    <header>
      <div className='container mt-4'>
        <h1>Identified Genes</h1>
      </div>
    </header>
    <main
      className='d-flex flex-fill position-relative overflow-hidden'
    >
      <div className='flex-fill d-flex flex-column p-2 overflow-auto'>
        {children}
      </div>
    </main>
  </div>
)

const GeneDisplay = ({ geneInfo, noResults }) => {
  const [queryResult, setQueryResult] = useState([])
  const [geneAlignment, setGeneAlignment] = useState({})
  const displayNames = useMemo(() => (
    geneInfo && geneInfo.panarooNames.split('~~~').filter(name => !['UNNAMED', 'PRED_'].includes(name))
  ), [geneInfo?.panarooNames])

  useEffect(() => {
    if (geneInfo?.foundIn_biosamples) {
      specificIsolateQuery(geneInfo.foundIn_biosamples).then(response => {
        setQueryResult(response)
      })
    }
  }, [geneInfo?.foundIn_biosamples])

  useEffect(() => {
    requestGeneAlignment().then(alignment => {
      setGeneAlignment(alignment)
    })
  }, [])

  if (noResults) {

  }

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
                    ['Gene frequency', `${((queryResult.length / 26616) * 100).toFixed(2)}%`]
                  ]}
                  />
                )}
              </LoadBox>
              <div className='my-4'>
                Gene was found in {queryResult.length} isolates
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

              <table>
                <thead>
                  <tr>
                    <th className='border'>Biosample accession</th>
                    <th className='border'>Species</th>
                    <th className='border'>Genome representation</th>
                    <th className='border'>Number of contigs</th>
                    <th className='border'>Download links</th>
                  </tr>
                </thead>
                <tbody>
                  {
                  queryResult.map(({
                    _source: {
                      BioSample,
                      Organism_name: organismName,
                      Genome_representation: genomeRepresentation,
                      contig_stats: contigStats,
                      sequenceURL
                    }
                  }, index) => (
                    <tr
                      key={BioSample}
                      className={index % 2 ? '' : 'bg-light'}
                    >
                      <td className='border'>
                        <Link
                          to={`/isolate/streptococcus/pneumoniae/${BioSample}`}
                          target='_blank'
                        >
                          {BioSample}
                        </Link>
                      </td>
                      <td className='border'>{organismName}</td>
                      <td className='border'>{genomeRepresentation}</td>
                      <td className='border'>
                        {
                          contigStats && contigStats.sequence_count
                        }
                      </td>
                      <td className='border' style={{ fontSize: '.75rem' }}>
                        {
                          (
                            sequenceURL instanceof Array
                              ? sequenceURL
                              : [sequenceURL]
                          ).map(link => (
                            <a
                              key={link}
                              href={link}
                              rel='noreferrer'
                            >
                              {link.split('/')[link.split('/').length - 1]}
                            </a>
                          ))
                        }
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </table>

              <LoadBox value={geneAlignment} className='mt-4'>
                {(genes) => (
                  <GeneVisualizer data={genes} />
                )}
              </LoadBox>
            </>
            )
      }
    </MainWrapper>
  )
}

export default GeneDisplay
