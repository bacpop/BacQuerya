import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from 'react-router-dom'
import xss from 'xss'

import { isIdentical } from '../utils'
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
    infiniteScroll: true,
    table: [
      ['Biosample accession', r => (
        <>
          <Link
            className='position-relative isolate-link'
            to={`/isolate/${r._source.BioSample}`}
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
      // ['Genome representation', r => r._source.Genome_representation],
      ['Country', r => r._source.Country],
      ['Year', r => r._source.Year],
      ['Number of Contigs', r => r._source.contig_stats?.sequence_count || ''],
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
                title={link.split('/')[link.split('/').length - 1]}
              >
                {
                  r._source.Genome_representation === 'full'
                    ? 'Assembly'
                    : 'Reads'
                }
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
    rowHeight: 32,
    table: [
      ['Study title', r => (
        <Link
          className='d-block max-w-readable'
          to={`/study/${r.encodedDOI}`}
          target='_blank'
          dangerouslySetInnerHTML={{
            __html: xss(r.Title)
          }}
        />
      )]
    ]
  },
  gene: {
    name: 'Gene',
    request: ({ searchFilters, ...props }) => geneQuery(props),
    infiniteScroll: true,
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
const ResultsTable = ({ searchResults }) => {
  const rendered = useMemo(() => {
    const tableInfo = typeRequest[searchResults.formState.searchType]
    return (
      <table
        className='w-100'
        style={{
          fontSize: '.8rem'
        }}
      >
        <thead>
          <tr>
            {
            tableInfo.table.map(([label]) => (
              <th
                key={label}
                className='sticky-top bg-white py-2 pr-3 align-text-top'
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
            <tr
              key={data._id || rowIndex}
              style={tableInfo.rowHeight && {
                height: `${tableInfo.rowHeight}px`
              }}
            >
              {
                tableInfo.table.map(([label, valueFn]) => (
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
    )
  }, [searchResults])
  return rendered
}

const SearchPage = () => {
  const searchInputRef = useRef()
  const tableWrapperRef = useRef()
  const [formState, setFormStateObject] = useState(() => ({
    searchType: 'isolate',
    searchTerm: '',
    pageNumber: 1,
    searchFilters: {
      assemblies: true,
      Country: 'All',
      Year: [
        // 'Start',
        // 'End'
        1985,
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
    searchPerformed: false,
    formState,
    searchResult: [],
    resultCount: 0
  })
  const [endOfResults, setEndOfResults] = useState(false)
  const [loading, setLoading] = useState(false)

  const setFormState = useCallback((newProps) => {
    const options = {
      ...formState,
      ...newProps,
      pageNumber: newProps.pageNumber || 1,
      searchFilters: {
        ...formState.searchFilters,
        ...(newProps.searchFilters || {})
      }
    }
    setFormStateObject(options)
    return options
  }, [formState, setFormStateObject])

  const searchResultUpdated = (
    !searchResults.searchPerformed ||
    !isIdentical(
      {
        ...formState,
        pageNumber: -1
      },
      {
        ...searchResults.formState,
        pageNumber: -1
      })
  )

  const search = useCallback((options) => {
    let cancelled = false
    const queryOptions = options || formState
    if (queryOptions.searchTerm === '') {
      return
    }
    let searchResultsState = searchResults
    let isNowEndOfResults = endOfResults
    if (queryOptions.pageNumber === 1) {
      if (isNowEndOfResults) {
        setEndOfResults(isNowEndOfResults = false)
      }
      searchResultsState = {
        searchPerformed: true,
        formState,
        searchResult: [],
        resultCount: 0
      }
      setSearchResults(searchResultsState)
    }
    if (!isNowEndOfResults) {
      setLoading(true)
    }
    setOpenDownloads(false)
    if (!isNowEndOfResults) {
      typeRequest[queryOptions.searchType].request(queryOptions)
        .then(({ resultCount, searchResult }) => {
          if (cancelled) {
            return
          }
          if (searchResult.length === 0) {
            setEndOfResults(true)
          }
          setLoading(false)
          if (queryOptions.pageNumber > 1) {
            setSearchResults({
              ...searchResultsState,
              searchResult: searchResults.searchResult.concat(searchResult),
              resultCount
            })
          } else {
            setSearchResults({
              ...searchResultsState,
              searchResult,
              resultCount
            })
          }
        })
    }
    return () => {
      cancelled = true
    }
  }, [
    endOfResults,
    formState,
    searchResults,
    setLoading,
    setEndOfResults,
    setSearchResults
  ])

  const loadNextPage = useCallback(() => {
    let cancelled = false
    const formState = {
      ...searchResults.formState,
      pageNumber: searchResults.formState.pageNumber + 1
    }

    setSearchResults({
      ...searchResults,
      formState
    })

    setLoading(true)
    typeRequest[formState.searchType].request(formState)
      .then(({ resultCount, searchResult }) => {
        if (cancelled) {
          return
        }
        if (searchResult.length === 0) {
          setEndOfResults(true)
        }
        setLoading(false)
        if (formState.pageNumber > 1) {
          setSearchResults({
            ...searchResults,
            formState,
            searchResult: searchResults.searchResult.concat(searchResult),
            resultCount
          })
        } else {
          setSearchResults({
            ...searchResults,
            formState,
            searchResult,
            resultCount
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [
    searchResults,
    setLoading
  ])

  useEffect(() => {
    searchInputRef.current.focus()
  }, [])

  useEffect(() => {
    if (loading || !typeRequest[searchResults.formState.searchType].infiniteScroll) {
      return
    }
    const onScroll = () => {
      if (
        !loading &&
        !endOfResults &&
        tableWrapperRef.current.scrollHeight <= window.scrollY + window.innerHeight
      ) {
        loadNextPage()
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
    endOfResults,
    searchResults,
    loading,
    loadNextPage,
    setFormState,
    setLoading,
    search
  ])

  return (
    <div
      className='d-flex mt-2 flex-column container text-left text-start h-100 position-absolute'
    >
      <div className='d-flex'>
        <div className='flex-fill d-flex flex-column mr-4'>
          <div className='mb-1'>
            <p class="mb-0"
            style={{
              fontSize: '.9rem'
            }}>Search for bacterial genomes and metadata</p>
          </div>
          <form
            className='d-flex mb-1'
            onSubmit={(e) => {
              e.preventDefault()
              search(
                setFormState({
                  pageNumber: 1
                })
              )
            }}
          >
            <input
              ref={searchInputRef}
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
                type='submit'
                className={`btn ${
                  searchResultUpdated
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                disabled={sequenceContainsInvalidChars || sequenceIsNotLongEnough}
              >
                Search
              </button>
            </div>
          </form>
          <div className='mb-1'>
              <div className='flex-fill'
              style={{
                fontSize: '.8rem'
              }}>
                {
                  formState.searchType === 'isolate' && (
                    "Examples: 'streptococcus pneumoniae nepal 23F', 'e coli IAI1'"
                  )
                }
                {
                  formState.searchType === 'study' && (
                    "Examples: 'International Genomic Definition of Pneumococcal Lineages', 'altschul SF blast'"
                  )
                }
                {
                  formState.searchType === 'gene' && (
                    "Examples: 'tetM', 'surface protein A', 'penicillin binding'"
                  )
                }
                {
                  formState.searchType === 'sequence' && (
                    "Example: 'ATTCCCACAATCTTTTTTATCAATAAGATTGACCAAAATGGAATTGATTTATCAA'"
                  )
                }
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
                  Enter a DNA sequence of a gene{' '}
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
      <hr
        className='my-4 w-100'
        style={{
          height: '1px'
        }}
      />
      <div
        ref={tableWrapperRef}
        style={{
          opacity: searchResultUpdated ? '0.6' : '1'
        }}
      >
        {
          (searchResults?.searchResult?.length
            ? (
              <>
                {
                  (
                    searchResults.formState.searchType === 'isolate' ||
                    searchResults.resultCount !== -1
                  ) && (
                    <div className='my-2 d-flex justify-content-between'>
                      {
                        searchResults.resultCount !== -1 && (
                          <div>
                            Results: {searchResults.resultCount.toLocaleString('en-US')}
                          </div>
                        )
                      }
                      {
                        searchResults.formState.searchType === 'isolate' && (
                          <>
                            {
                              showDownloadOptions && (
                                <div
                                  className='position-absolute bg-light rounded p-2 mx-2'
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
                          </>
                        )
                      }
                    </div>
                  )
                }
                <ResultsTable {...{ searchResults }} />
              </>
              )
            : null)
        }
        <div
          className='position-relative d-flex align-items-center justify-content-center'
          style={{
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
          {
            (
              !loading &&
              searchResults.searchResult.length === 0 &&
              searchResults.searchPerformed
            ) && (
              <div className='text-secondary'>
                &lt;There are no results&gt;
              </div>
            )
          }
          {
            (
              !loading &&
              searchResults.searchResult.length > 0 &&
              endOfResults
            ) && (
              <div className='text-secondary'>
                &lt;End of results&gt;
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SearchPage
