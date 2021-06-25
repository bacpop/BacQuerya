import { useCallback, useEffect, useRef, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from 'react-router-dom'

import isolateQuery from './indexQuerying/isolateQuery'
import studyQuery from './indexQuerying/studyQuery'
import geneQuery from './indexQuerying/geneQuery'
import sequenceQuery from './indexQuerying/sequenceQuery'
import FilterComponent from './searchFilters'
import { SequenceDownload } from './sequenceDownload'
import '../CSS/searchPage.css'

const splitGeneNames = (result) => {
  const panarooNames = result._source.panarooNames || ''
  const consistentName = result._source.consistentNames
  const pFamNames = result._source?.pfam_names

  if (!consistentName) {
    return []
  }

  const vals = panarooNames.split('~~~').concat(pFamNames)
    .filter(name => name && !(['UNNAMED_', 'PRED_'].some(n => name.includes(n))))
    .sort((a, b) => a === consistentName - b === consistentName)
    .map(name => (
      <Link
        key={name}
        to={`/gene/${name}`}
        target='_blank'
      >
        {name}
      </Link>
    ))

  return vals
}

const typeRequest = {
  isolate: {
    name: 'Isolate',
    request: isolateQuery,
    table: [
      ['Biosample accession', r => (
        <>
          <Link
            className='position-relative isolate-link'
            to={`/isolate/streptococcus/pneumoniae/${r._source.BioSample}`}
            target='_blank'
          >
            {r._source.BioSample}
          </Link>
          <div
            className='isolate-summary'
          >
            <p>Organism: {r._source.Organism_name}</p>
            <p>Isolate name: {r._source.isolateName}</p>
            <p>Genome representation: {r._source.Genome_representation}</p>
            {r._source?.source && <p>Source: {r._source.source}</p>}
            <p>BioSample accession: {r._source.BioSample}</p>
            {
              r._source?.scaffold_stats && (
                <>
                  <p>Total sequence length: {r._source.contig_stats.total_bps}</p>
                  <p>N50: {r._source.contig_stats.N50}</p>
                  <p>G/C content: {r._source.contig_stats.gc_content.toFixed()}%</p>
                </>
              )
            }

          </div>
        </>
      )],
      ['Species', r => r._source.Organism_name],
      ['Genome representation', r => r._source.Genome_representation],
      ['Number of contigs', r => r._source.contig_stats?.sequence_count || ''],
      ['Download links', r => (
        <>
          {
            (
              r._source.sequenceURL instanceof Array
                ? r._source.sequenceURL
                : [r._source.sequenceURL]
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
        </>
      )]
    ]
  },
  study: {
    name: 'Study',
    request: formState => studyQuery({
      searchTerm: formState.searchTerm,
      source: formState.searchType,
      pageNumber: formState.pageNumber
    }),
    table: [
      ['Study title', r => (
        <Link
          className='py-2'
          to={`/study/${r.encodedDOI}`}
          target='_blank'
        >
          {r.Title}
        </Link>
      )]
    ]
  },
  gene: {
    name: 'Gene',
    request: ({ searchFilters, ...props }) => geneQuery(props),
    table: [
      ['Gene Name', r => splitGeneNames(r)[0]],
      ['Aliases', r => (
        <>{
          splitGeneNames(r).slice(1).reduce((output, link) => (
            <>
              {output}{output ? ', ' : ''}{link}
            </>
          ), '')
        }
        </>
      )],
      ['Description', r => (
        r._source.pfam_descriptions
          ? [
              r._source.panarooDescriptions
            ].concat(
              r._source.pfam_descriptions
            ).slice(0, 1).join('; ')
          : r._source.panarooDescriptions.slice(0, 1).join('; ')
      )]
    ]
  },
  sequence: {
    name: 'Sequence',
    request: ({ searchTerm }) => sequenceQuery({ searchTerm }),
    table: [
      ['Gene Name', r => (
        <Link
          target='_blank'
          to={`/gene/${r.geneName}`}
        >
          {r.geneName}
        </Link>
      )],
      ['Match Proportion', r => `${r.numberMatching}%`]
    ]
  }
}

// Biosample accessionSpeciesGenome representationNumber of contigs

const SearchPage = () => {
  const tableWrapperRef = useRef()
  const [formState, setFormStateObject] = useState(() => ({
    searchType: 'isolate',
    searchTerm: '',
    pageNumber: 0,
    searchFilters: {
      assemblies: true,
      Country: 'All',
      Year: [
        // 'Start',
        // 'End'
        new Date().getFullYear() - 50,
        new Date().getFullYear()
      ],
      minN50: 0,
      noContigs: 'All',
      reads: true
    }
  }))
  const [showDownloadOptions, setOpenDownloads] = useState(false)

  const sequenceContainsInvalidChars = (
    formState.searchType === 'sequence' && (
      formState.searchTerm.length === 0 ||
      formState.searchTerm.split('').some(char => !['A', 'T', 'C', 'G'].includes(char.toUpperCase()))
    )
  )

  const sequenceIsNotLongEnough = (
    formState.searchType === 'sequence' &&
    formState.searchTerm.length < 31
  )

  // The structure varies depending on what's returned
  const [searchResults, setSearchResults] = useState({
    formState,
    searchResult: [],
    count: 0
  })
  const [endOfResults, setEndOfResults] = useState(false)
  const [loading, setLoading] = useState(false)

  const setFormState = useCallback((newProps) => {
    const options = {
      ...formState,
      ...newProps,
      pageNumber: newProps.pageNumber || 0,
      searchFilters: {
        ...formState.searchFilters,
        ...(newProps.searchFilters || {})
      }
    }
    // The back-end does not handle pageNumber = 0 well
    if (!options.pageNumber) {
      delete options.pageNumber
    }
    setFormStateObject(options)
    return options
  }, [formState, setFormStateObject]);

  const search = useCallback((options) => {
    let cancelled = false
    const queryOptions = options || formState
    if (queryOptions.searchTerm === '') {
      return
    }
    let searchResultsState = searchResults
    if (!queryOptions.pageNumber) {
      if (endOfResults) {
        setEndOfResults(false)
      }
      searchResultsState = {
        formState,
        searchResult: [],
        count: 0
      }
      setSearchResults(searchResultsState)
    }
    setLoading(true)
    setOpenDownloads(false)
    if (!endOfResults) {
      typeRequest[queryOptions.searchType].request(queryOptions)
        .then(response => {
          if (cancelled) {
            return
          }
          if (response.length === 0) {
            setEndOfResults(true)
          }
          setLoading(false)
          if (queryOptions.pageNumber) {
            setSearchResults({
              ...searchResultsState,
              searchResult: searchResults.searchResult.concat(response)
            })
          } else {
            setSearchResults({
              ...searchResultsState,
              searchResult: response,
              count: 0
            })
          }
        })
    }
    return () => {
      cancelled = true
    }
  }, [setLoading, endOfResults, setEndOfResults, formState, searchResults])

  useEffect(() => {
    const onScroll = () => {
      if (
        !loading &&
        tableWrapperRef.current.scrollHeight <= window.scrollY + window.innerHeight
      ) {
        search(
          setFormState({
            pageNumber: (formState.pageNumber || 0) + 1
          })
        )
      }
    }
    const events = [
      'scroll',
      'wheel',
      'resize'
    ]
    events.forEach(event => {
      window.addEventListener(event, onScroll, true)
    })
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, onScroll, true)
      })
    }
  }, [
    formState,
    loading,
    setFormState,
    setLoading,
    search
  ])

  return (
    <div
      className='d-flex flex-column container text-left text-start h-100 position-absolute'
    >
      <header>
        <div className='container mt-4 d-flex justify-content-between'>
          <h1>Bacquerya</h1>
          <Link to='/about'>About</Link>
        </div>
      </header>
      <div className='d-flex'>
        <div className='flex-fill d-flex flex-column mr-4'>
          <div className='d-flex  mb-4'>
            <input
              name='searchTerm'
              className='flex-fill mr-2 form-control'
              value={formState.searchTerm}
              onChange={e => {
                setFormState({
                  searchTerm: e.target.value
                })
              }}
            />
            <div className='d-flex align-items-end'>
              <button
                className='btn btn-primary'
                disabled={sequenceContainsInvalidChars}
                onClick={() => {
                  search(
                    setFormState({
                      pageNumber: 0
                    })
                  )
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div className='btn-group'>
            {
              ['isolate', 'study', 'gene', 'sequence']
                .map((value) => (
                  <button
                    key={value}
                    className={`btn-primary btn ${formState.searchType === value ? 'active' : ''}`}
                    onClick={() => {
                      setFormState({
                        searchType: value
                      })
                    }}
                  >
                    {typeRequest[value].name}
                  </button>
                ))
            }
          </div>
        </div>
        <div className='flex-fill mx-2'>
          {
            formState.searchType === 'isolate' && (
              <FilterComponent {...{ formState, setFormState }} />
            )
          }
          {
            formState.searchType === 'sequence' && (
              <div style={{ maxWidth: '300px' }}>
                <h6>Gene Sequence</h6>
                <p>
                  Enter a gene chemical sequence{' '}
                  <span
                    className={sequenceContainsInvalidChars ? 'font-weight-bold' : ''}
                  >
                    containing only "A", "T", "C", and "G"
                  </span>{' '}
                  <span
                    className={sequenceIsNotLongEnough ? 'font-weight-bold' : ''}
                  >
                    that is at least 31 characters long.
                  </span>
                </p>
                {

                }
              </div>

            )
          }
        </div>
      </div>
      <div className='mt-4' ref={tableWrapperRef}>
        {
          (searchResults?.searchResult?.length
            ? (
              <>
                {
                  searchResults.formState.searchType === 'isolate' && (
                    <div className='my-2 d-flex flex-row-reverse'>
                      {
                        showDownloadOptions && (
                          <div
                            className='position-absolute bg-light rounded p-2'
                            style={{
                              right: '0',
                              width: '500px',
                              zIndex: '100000',
                              boxShadow: '0 2px 6px rgb(0,0,0,.5)'
                            }}
                          >
                            <SequenceDownload
                              setOpenDownloads={setOpenDownloads}
                              sequenceUrls={searchResults.searchResult.map(r => r._source.sequenceURL)}
                            />
                          </div>

                        )
                      }
                      <button
                        className='btn btn-primary btn-sm'
                        onClick={() => setOpenDownloads(true)}
                      >
                        Download all sequences
                      </button>
                    </div>
                  )
                }
                <table
                  className='w-100'
                  style={{
                    fontSize: '.8rem'
                  }}
                >
                  <thead>
                    <tr>
                      {
                      typeRequest[searchResults.formState.searchType].table.map(([label]) => (
                        <th
                          key={label}
                          className='sticky-top bg-white py-2 pr-3'
                        >
                          {label}
                        </th>
                      ))
                    }
                    </tr>
                  </thead>
                  <tbody>
                    {
                    searchResults.searchResult.map((data, rowIndex) => (
                      <tr key={data._id || rowIndex}>
                        {
                          typeRequest[searchResults.formState.searchType].table.map(([label, valueFn]) => (
                            <td
                              key={label}
                              className='pr-3'
                            >
                              {valueFn(data)}
                            </td>
                          ))
                        }
                      </tr>
                    ))
                  }
                  </tbody>
                </table>
              </>
              )
            : null)
        }
        <div
          style={{
            position: 'relative',
            marginTop: '10px',
            marginBottom: '200px'
          }}
        >
          {
            loading && !endOfResults
              ? (
                <Spinner
                  className='search-spinner'
                  animation='border'
                  variant='primary'
                />
                )
              : null
          }
        </div>
      </div>
    </div>
  )
}

export default SearchPage
