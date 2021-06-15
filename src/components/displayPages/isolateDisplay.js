import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { populationAssemblyStats as requestPopulationAssemblyStats } from '../indexQuerying/isolateQuery.js'

import KeyVals from '../common/KeyVals.js'

const penicillinSIR = abbreviation => {
  if (!abbreviation) {
    return null
  }
  switch (abbreviation) {
    case 'S':
      return 'Susceptible'
    case 'I':
      return 'Intermediate'
    case 'R':
      return 'Resistant'
    default:
      return abbreviation
  }
}

// function to download isolate metadata as a JSON
const getJsonHref = (data) =>
  URL.createObjectURL(
    new window.Blob(
      [JSON.stringify(data)],
      { type: 'text/plain' }
    )
  )

const NavLink = ({ to = '', children }) => (
  <Link to={`/isolate/streptococcus${to}`} target='_blank'>{children}</Link>
)

const SectionContainer = ({ title, children }) => (
  <div className='container mb-4'>
    <h4>{title}</h4>
    {children}
  </div>
)

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
  const canvasRef = useRef()
  const [dimensions, setDimensions] = useState(0)
  const yAxisMargin = 24

  useEffect(() => {
    let isRendering = false
    const update = ({ context, width, height }) => {
      context.save()
      const barWidth = width / data.length
      const total = data.reduce((total, n) => Math.max(total, n), 0)

      context.fillStyle = '#aaa'
      context.fillRect(0, 0, width, height)

      context.font = `${barWidth / 2}px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`

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
          context.translate(Math.floor((index + 1) * barWidth) - 6, height - 10)
          context.rotate(270 * Math.PI / 180)
          context.fillText(n, 0, 0)
          context.restore()
        }
      })

      context.restore()
    }
    const prepRerender = () => {
      if (isRendering) return
      isRendering = true
      window.requestAnimationFrame(() => {
        isRendering = false

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const { width: rawWidth, height } = canvas.parentNode.getBoundingClientRect()
        const width = rawWidth

        const ratio = window.devicePixelRatio || 1

        canvas.width = ratio * width
        canvas.height = ratio * height
        context.scale(ratio, ratio)
        update({ context, width, height })

        // Recalc the width AFTER render
        const { width: widthAfter, height: heightAfter } = canvas.parentNode.getBoundingClientRect()
        setDimensions({
          width: widthAfter,
          height: heightAfter
        })
      })
    }
    prepRerender()
    window.addEventListener('resize', prepRerender, true)
    return () => window.removeEventListener('resize', prepRerender, true)
  }, [setDimensions, active, scale, data])

  return (
    <div className='d-flex flex-column overflow-hidden position-relative' {...props}>
      <h6
        className='position-absolute'
        style={{
          transform: 'rotate(270deg)',
          transformOrigin: `${dimensions.height / 2}px ${dimensions.height / 2}px`,
          width: `${dimensions.height}px`,
          top: `${yAxisMargin - 4}px`
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
          margin: `0 ${yAxisMargin}px`
        }}
      >
        <canvas ref={canvasRef} className='w-100 h-100' />
      </div>
      <div
        className='position-absolute d-flex justify-content-between'
        style={{
          transform: 'rotate(270deg)',
          transformOrigin: `${dimensions.height / 2}px ${dimensions.height / 2}px`,
          width: `${dimensions.height}px`,
          top: `${yAxisMargin - 4}px`,
          left: `${dimensions.width + yAxisMargin}px`,
          fontSize: `${(dimensions.width / 2 / labels.length)}px`
        }}
      >
        <div>{min}</div>
        <div>{max}</div>
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
                  fontSize: `${(dimensions.width / 2 / labels.length)}px`
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
}

export default ({
  isolateInfo
}) => {
  const [populationAssemblyStats, setPopulationAssemblyStats] = useState({
    min: 0,
    max: 0,
    groups: []
  })
  const [searchFilter, setSearchFilter] = useState('')
  const [histogramScale, setHistogramScale] = useState(1)
  const sortedConsistentNames = useMemo(
    () => (isolateInfo.consistentNames || [])
      .concat()
      .sort((a, b) => a > b ? 1 : a < b ? -1 : 0),
    [isolateInfo.consistentNames]
  )

  const [filteredResults, setFilteredResults] = useState()
  const [downloadHref] = useState(() => getJsonHref(isolateInfo))

  const activeRows = useMemo(() => {
    const contigRow = isolateInfo.contig_stats.N50
    return populationAssemblyStats.groups.map(
      contigs => contigs.reduce(
        (total, { contig_N50: contigN50 }) => total + (`${contigN50}` === `${contigRow}`),
        0
      )
    )
  }, [populationAssemblyStats])

  const histogramProps = useMemo(() => {
    if (!isolateInfo) return Array.from(Array(populationAssemblyStats.groups.length)).map((_) => [])

    let minGroupCount = Infinity
    let maxGroupCount = 0
    populationAssemblyStats.groups.forEach(group => {
      minGroupCount = Math.min(minGroupCount, group.length)
      maxGroupCount = Math.max(maxGroupCount, group.length)
    })

    return {
      xAxisLabel: 'Frequency',
      yAxisLabel: 'Frequency Density',
      min: minGroupCount.toLocaleString('en-US'),
      max: Math.round(maxGroupCount / histogramScale).toLocaleString('en-US'),
      scale: histogramScale,
      style: {
        height: '500px'
      },
      labels: Array.from(Array(populationAssemblyStats.groups.length)).map((_, index) => {
        const range = populationAssemblyStats.max - populationAssemblyStats.min
        const interval = range / populationAssemblyStats.groups.length

        const start = populationAssemblyStats.min + (interval * index)

        return Math.round(start).toLocaleString('en-US')
      }),
      active: activeRows,
      data: populationAssemblyStats.groups.map(interval => interval.length)
    }
  }, [histogramScale, populationAssemblyStats, isolateInfo])

  const updateResults = useCallback(() => {
    setFilteredResults(
      sortedConsistentNames
        .filter(name => searchFilter.includes(name) || name.includes(searchFilter))
        .map((name, index) => (
          <Link
            key={`${name}-${index}`}
            to={`/gene/${name}`}
            target='_blank'
            rel='noreferrer'
            className={`d-block ${index % 2 ? 'bg-white' : 'bg-light'}`}
          >
            {name}
          </Link>
        ))
    )
  }, [searchFilter, sortedConsistentNames, setFilteredResults])

  useEffect(() => {
    const timeout = setTimeout(updateResults, 100)
    return () => clearTimeout(timeout)
  }, [updateResults])

  useEffect(() => {
    requestPopulationAssemblyStats().then((data) => {
      setPopulationAssemblyStats(data)
    })
  }, [])

  return (
    <div className='d-flex flex-column container text-left text-start h-100 position-absolute'>
      <header>
        <div className='container mt-4 mb-2'>
          <NavLink>streptococcus</NavLink>{' > '}
          <NavLink to='/pneumoniae'>pneumoniae</NavLink>{' > '}
          <NavLink to={`/pneumoniae/${isolateInfo.BioSample}`}>{isolateInfo.BioSample}</NavLink>
        </div>
        <div className='container'>
          <h1>Isolate: {isolateInfo.isolateName}</h1>
        </div>
      </header>
      <main
        className='d-flex flex-fill position-relative overflow-hidden mb-4'
      >
        <div className='flex-fill p-2 overflow-auto'>
          <SectionContainer title='Overview'>
            <KeyVals items={[
              ['Organism', isolateInfo.Organism_name],
              ['Strain', isolateInfo.Infraspecific_name],
              ['Assembly name', isolateInfo.Assembly_name],
              ['Assembly level', isolateInfo.Assembly_level],
              ['Genome representation', isolateInfo.Genome_representation],
              ['Submitter', isolateInfo.Submitter],
              ['Date submitted', isolateInfo.Date],
              ['Taxid', isolateInfo.Taxid],
              [
                'GenBank assembly accession',
                isolateInfo.GenBank_assembly_accession,
                { link: `https://www.ncbi.nlm.nih.gov/biosample/${isolateInfo.BioSample}` }
              ]
            ]}
            />
            {
            isolateInfo.sequenceURL && (
              <>
                <h5 className='mt-4'>Download assembly files:</h5>
                <div className='flex flex-wrap'>
                  {
                    (
                      isolateInfo.sequenceURL instanceof Array
                        ? isolateInfo.sequenceURL
                        : [isolateInfo.sequenceURL]
                    ).map(link => (
                      <a
                        key={link}
                        className='btn btn-secondary m-2'
                        href={link}
                        rel='noreferrer'
                      >
                        {link.split('/')[link.split('/').length - 1]}
                      </a>
                    ))
                    }
                </div>
              </>
            )
            }
          </SectionContainer>
          <SectionContainer title='BioSample metadata'>
            <KeyVals items={[
              ['Submission date', isolateInfo.BioSample_SubmissionDate],
              ['Last updated', isolateInfo.BioSample_LastUpdate],
              ['Specific host', isolateInfo.BioSample_SpecificHost],
              ['Isolation source', isolateInfo.BioSample_IsolationSource],
              ['Host health status', isolateInfo.BioSample_HostHealthState],
              ['Serotype', isolateInfo.BioSample_SeroVar],
              ['Collection location', isolateInfo.BioSample_CollectionLocation],
              ['Owner', isolateInfo.BioSample_Owner],
              ['INSDC center name', isolateInfo.BioSample_INSDCCenterName],
              ['Status', isolateInfo.BioSample_Status]
            ]}
            />
          </SectionContainer>
          <SectionContainer title='Additional metadata'>
            <KeyVals items={[
              [
                'ERR accession',
                isolateInfo.ERR,
                {
                  link: `https://www.ebi.ac.uk/ena/browser/view/${isolateInfo.ERR}`
                }
              ],
              [
                'ERS accession',
                isolateInfo.ERS,
                {
                  link: `https://www.ebi.ac.uk/ena/browser/view/${isolateInfo.ERS}`
                }
              ],
              [
                'WGS project',
                isolateInfo.WGS_project,
                {
                  link: `https://www.ebi.ac.uk/ena/browser/view/${isolateInfo.WGS_project}`
                }
              ],
              ['Collection year', isolateInfo.Year],
              ['Country', isolateInfo.Country],
              ['GPSC', isolateInfo.GPSC],
              ['In silico serotype', isolateInfo.In_Silico_Serotype],
              ['In silico sequence type', isolateInfo.In_Silico_St],
              ['Host disease state', isolateInfo.Disease],
              ['Host age group', isolateInfo.Age_group],
              ['Vaccine period', isolateInfo.Vaccine_Period],
              ['Vaccine status', isolateInfo.Vaccine_Status],
              ['Penicillin susceptibility', penicillinSIR(isolateInfo.WGS_PEN_SIR_Nonmeningitis)]
            ]}
            />
          </SectionContainer>
          {
            isolateInfo.scaffold_stats && (
              <SectionContainer title='Assembly statistics'>
                <KeyVals items={[
                  ['Total sequence length', isolateInfo.scaffold_stats.total_bps],
                  ['L50', isolateInfo.scaffold_stats.L50],
                  ['N50', isolateInfo.scaffold_stats.N50],
                  ['G/C content', `${isolateInfo.scaffold_stats.gc_content.toFixed()}%`],
                  ['Number of contigs', isolateInfo.contig_stats.sequence_count],
                  ['Longest contig length', `${isolateInfo.contig_stats.longest}bp`],
                  ['Shortest contig length', `${isolateInfo.contig_stats.shortest}bp`],
                  ['Mean contig length', `${isolateInfo.contig_stats.mean.toFixed(1)}bp`]

                ]}
                />
              </SectionContainer>
            )
          }
          <SectionContainer>
            <h4 className='mt-2'>N50 Distribution</h4>
            <div
              className='d-flex'
              style={{
                marginRight: '35px'
              }}
            >
              <Histogram {...histogramProps} />
            </div>
            <input
              type='range'
              value={histogramScale}
              min={1}
              max={200}
              step={0.01}
              style={{
                marginLeft: '30px',
                width: 'calc(100% - 100px)'
              }}
              onChange={(e) => setHistogramScale(e.target.value)}
            />
          </SectionContainer>
          <SectionContainer>
            <div className='btn-group'>
              <a
                className='btn btn-secondary'
                href={downloadHref}
                download={`${isolateInfo.BioSample}.json`}
              >
                Download metadata
              </a>
            </div>
          </SectionContainer>
        </div>
        <div
          className='flex-fill d-flex flex-column p-2 overflow-auto'
          style={{
            minWidth: '225px'
          }}
        >
          <h4>Identified Genes</h4>
          <input
            className='w-100'
            placeholder='Filter'
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
          />
          <div className='flex-fill overflow-auto'>
            {filteredResults}
          </div>
        </div>
      </main>

    </div>
  )
}
