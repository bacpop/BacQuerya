import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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

const KeyVals = ({ items }) => (
  <table className='w-100'>
    <tbody>
      {
        items.filter(([_, value]) => value != null).map(([label, value, options], index) => (
          <tr
            key={`${label}-${index}`}
            className={index % 2 ? '' : 'bg-light'}
          >
            <td
              className='pr-2'
              style={{
                width: '1%',
                whiteSpace: 'nowrap'
              }}
            >
              {label}:
            </td>
            <td>
              {
                options && options.link
                  ? (
                    <a
                      href={options.link}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {value}
                    </a>
                    )
                  : value
              }
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>
)

const SectionContainer = ({ title, children }) => (
  <div className='container mb-4'>
    <h4>{title}</h4>
    {children}
  </div>
)

export default ({
  isolateInfo
}) => {
  const [searchFilter, setSearchFilter] = useState('')
  const sortedConsistentNames = useMemo(
    () => (isolateInfo.consistentNames || [])
      .concat()
      .sort((a, b) => a > b ? 1 : a < b ? -1 : 0),
    [isolateInfo.consistentNames]
  )

  const [filteredResults, setFilteredResults] = useState()
  const [downloadHref] = useState(() => getJsonHref(isolateInfo))

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
        className='d-flex flex-fill position-relative overflow-hidden'
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
                <div className='btn-group'>
                  {
                    (
                      isolateInfo.sequenceURL instanceof Array
                        ? isolateInfo.sequenceURL
                        : [isolateInfo.sequenceURL]
                    ).map(link => (
                      <a
                        key={link}
                        className='btn btn-secondary'
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
          <div className='btn-group'>
            <a
              className='btn btn-secondary'
              href={downloadHref}
              download={`${isolateInfo.BioSample}.json`}
            >
              Download metadata
            </a>
          </div>

        </div>
        <div className='flex-fill d-flex flex-column p-2 overflow-auto'>
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
