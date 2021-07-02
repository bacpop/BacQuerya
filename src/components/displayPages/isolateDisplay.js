import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  populationAssemblyStatsN50,
  populationAssemblyStatsGcContent,
  populationAssemblyTotalBps,
  populationAssemblyContigCount
} from '../indexQuerying/isolateQuery.js'
import Histogram from '../common/Histogram.js'
import StackedBar from '../common/StackedBar.js'

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

// const NavLink = ({ to = '', children }) => (
//   <Link to={`/isolate/streptococcus${to}`} target='_blank'>{children}</Link>
// )

const SectionContainer = ({ title, children }) => (
  <div className='container mb-4'>
    <h4>{title}</h4>
    {children}
  </div>
)

const graphOptions = [
  {
    button: 'N50',
    title: 'Species N50 Distribution',
    xAxis: 'N50',
    yAxis: 'Population frequency',
    isolateInfoProp: 'N50',
    populationAssemblyProp: 'contig_N50',
    populationAssemblyRequest: populationAssemblyStatsN50
  },
  {
    button: 'GC Content',
    title: 'Species GC Content Distribution',
    xAxis: 'GC Content',
    yAxis: 'Population frequency',
    isolateInfoProp: 'gc_content',
    populationAssemblyProp: 'gc_content',
    populationAssemblyRequest: populationAssemblyStatsGcContent,
    roundDigits: -100000
  },
  {
    button: 'Total BPS',
    title: 'Total BPS',
    xAxis: 'Genome length (bp)',
    yAxis: 'Population frequency',
    isolateInfoProp: 'total_bps',
    populationAssemblyProp: 'genome_length',
    populationAssemblyRequest: populationAssemblyTotalBps
  },
  {
    button: 'Contig Count',
    title: 'Contig Count',
    xAxis: 'Number of contigs',
    yAxis: 'Population frequency',
    isolateInfoProp: 'sequence_count',
    populationAssemblyProp: 'contig_count',
    populationAssemblyRequest: populationAssemblyContigCount
  },
  {
    custom: (props) => <StackedBar {...props} />,
    button: 'Species Containment',
    title: 'Species Containment',
    xAxis: 'x-axis',
    yAxis: 'y-axis'
  }
]

const IsolateDisplay = ({
  isolateInfo
}) => {
  const [populationAssemblyStats, setPopulationAssemblyStats] = useState({
    min: 0,
    max: 0,
    groups: []
  })
  const [searchFilter, setSearchFilter] = useState('')
  const [graphScale, setGraphScale] = useState(1)
  const sortedConsistentNames = useMemo(
    () => (isolateInfo.consistentNames || [])
      .concat()
      .sort((a, b) => a > b ? 1 : a < b ? -1 : 0),
    [isolateInfo.consistentNames]
  )
  const [filteredResults, setFilteredResults] = useState()
  const [downloadHref] = useState(() => getJsonHref(isolateInfo))
  const [activeGraphIndex, setActiveGraphIndex] = useState(0)
  const activeGraph = graphOptions[activeGraphIndex]

  const activeRows = useMemo(() => {
    if (activeGraph.custom) {
      return {}
    }
    const contigRow = isolateInfo.contig_stats[activeGraph.isolateInfoProp]
    return populationAssemblyStats.groups.map(
      contigs => contigs.reduce(
        (total, { [activeGraph.populationAssemblyProp]: val }) => total + (`${val}` === `${contigRow}`),
        0
      )
    )
  }, [populationAssemblyStats, activeGraph, isolateInfo])

  const histogramProps = useMemo(() => {
    if (activeGraph.custom) {
      return {}
    }
    if (!isolateInfo) return Array.from(Array(populationAssemblyStats.groups.length)).map((_) => [])

    let minGroupCount = Infinity
    let maxGroupCount = 0
    populationAssemblyStats.groups.forEach(group => {
      minGroupCount = Math.min(minGroupCount, group.length)
      maxGroupCount = Math.max(maxGroupCount, group.length)
    })

    return {
      xAxisLabel: activeGraph.xAxis,
      yAxisLabel: activeGraph.yAxis,
      min: minGroupCount.toLocaleString('en-US'),
      max: Math.round(maxGroupCount / graphScale).toLocaleString('en-US'),
      scale: +graphScale,
      style: {
        height: '500px'
      },
      labels: Array.from(Array(populationAssemblyStats.groups.length)).map((_, index) => {
        const range = populationAssemblyStats.max - populationAssemblyStats.min
        const interval = range / populationAssemblyStats.groups.length
        const start = populationAssemblyStats.min + (interval * index)

        return start.toLocaleString('en-US')
      }),
      active: activeRows,
      data: populationAssemblyStats.groups.map(interval => interval.length)
    }
  }, [graphScale, populationAssemblyStats, isolateInfo, activeGraph, activeRows])

  // Don't worry about this data too much, important thing is getting the chart working
  const speciesContainmentProps = useMemo(() => {
    // return isolateInfo
    return {
      ratioScale: +graphScale,
      data: isolateInfo.mashHashes.map((ratioStr, index) => {
        // Convert "562/1000" -> 562
        const ratio = +ratioStr.split('/')[0]
        const fullSpeciesName = isolateInfo.mashSpecies[index]
        const species = fullSpeciesName
          .split(' ')
          .filter((_, i) => [3, 4].includes(i))
          .join(' ')

        return {
          ratio,
          species,
          fullSpeciesName
        }
      }).reduce((result, row) => {
        const existingRowIndex = result.findIndex(r => r.species === row.species)
        if (existingRowIndex !== -1) {
          const existingRow = result[existingRowIndex]
          // splice mutates the array!
          result.splice(existingRowIndex, 1, {
            ...existingRow,
            rows: existingRow.rows.concat(row),
            ratio: existingRow.ratio + row.ratio
          })
          return result
        }
        return [
          ...result,
          {
            species: row.species,
            rows: [row],
            ratio: row.ratio
          }
        ]
      }, []).map(({ species, ratio }) => ({
        label: `${species} (${ratio})`,
        amount: ratio
      }))
    }
  }, [graphScale, isolateInfo])

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
    const timeout = setTimeout(() => {
      setPopulationAssemblyStats({
        min: 0,
        max: 0,
        groups: []
      })
    }, 200)

    if (!graphOptions[activeGraphIndex].populationAssemblyRequest) {
      clearTimeout(timeout)
      return
    }

    graphOptions[activeGraphIndex].populationAssemblyRequest().then((data) => {
      clearTimeout(timeout)
      setPopulationAssemblyStats(data)
    })
    return () => {
      clearTimeout(timeout)
    }
  }, [activeGraphIndex])

  return (
    <div className='d-flex flex-column container text-left text-start h-100 position-absolute'>
      {/*
      Commenting out for now
      <div className='container mt-4 mb-2'>
        <NavLink>streptococcus</NavLink>{' > '}
        <NavLink to='/pneumoniae'>pneumoniae</NavLink>{' > '}
        <NavLink to={`/pneumoniae/${isolateInfo.BioSample}`}>{isolateInfo.BioSample}</NavLink>
      </div>
      */}
      <div className='container'>
        <h1>Isolate: {isolateInfo.isolateName}</h1>
      </div>
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
            <div className='btn-group'>
              {
                graphOptions.map(({ button }, index) => (
                  <button
                    key={`${button}-${index}`}
                    className={`btn btn-secondary${index === activeGraphIndex ? ' active' : ''}`}
                    onClick={
                      () => {
                        setActiveGraphIndex(index)
                      }
                    }
                  >
                    {button}
                  </button>
                ))
              }
            </div>
            <h4 className='mt-2'>{activeGraph.title}</h4>
            <div
              className='d-flex'
              style={{
                marginRight: '35px'
              }}
            >
              {
                activeGraph.custom
                  ? activeGraph.custom(speciesContainmentProps)
                  : <Histogram {...histogramProps} />
              }

            </div>
            <input
              type='range'
              value={graphScale}
              min={1}
              max={100}
              step={0.01}
              style={{
                marginLeft: '30px',
                width: 'calc(100% - 100px)'
              }}
              onChange={(e) => setGraphScale(e.target.value)}
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

export default IsolateDisplay
