import React, { useEffect, useRef, useState } from 'react'
import '../CSS/header.css'

const AboutContent = ({ visible }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const summaryRef = useRef()
  const moreInfoRef = useRef()

  const toggleDetail = () => {
    setDetailVisible(!detailVisible)
    try {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      })
    } catch (error) {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    if (!visible) {
      setMaxHeight(0)
      setDetailVisible(false)
    }
    const onResize = () => {
      const summaryHeight = summaryRef.current.getBoundingClientRect().height + 3
      const fullHeight = summaryHeight + moreInfoRef.current.getBoundingClientRect().height + 100

      setMaxHeight(detailVisible ? fullHeight : summaryHeight)

      Array.from(summaryRef.current.querySelectorAll('[tabIndex]')).forEach(e => {
        e.setAttribute('tabIndex', visible ? 0 : -1)
      })

      Array.from(moreInfoRef.current.querySelectorAll('[tabIndex]')).forEach(e => {
        e.setAttribute('tabIndex', visible && detailVisible ? 0 : -1)
      })
    }
    onResize()
    window.addEventListener('resize', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize, true)
    }
  }, [visible, detailVisible, setMaxHeight])

  return (
    <div
      className={`mx-3 overflow-hidden ${visible ? 'mb-5' : ''}`}
      style={{
        transitionDuration: '500ms',
        maxWidth: '60rem',
        maxHeight: visible ? `${maxHeight}px` : '0'
      }}
    >
      <div ref={summaryRef}>
        <span className='d-block'>
          <p className='lead font-thin'>Search for isolate names (ENA, SRA), species, metadata (country,
            serotype) or any combination of the above, flexibly.
          </p>

          <div className='font-weight-light'>
            <p>BacQuerya is currently 'enhanced' for the following species,
              and has additional linked, searchable gene and sequence data:
            </p>
            <ul><li><em>Streptococcus pneumoniae</em></li></ul>
          </div>
        </span>

        <hr
          className='my-4 w-100'
          style={{
            height: '1px'
          }}
        />

        <div className='container d-flex justify-content-between align-items-center bg-white'>
          <div className='d-flex flex-column align-items-center'>
            <button tabIndex='0' className='plain-link btn btn-link' onClick={toggleDetail}>
              <i className='bi bi-hover bi-file-earmark-text-fill' aria-label='Video' />
              <p className='small'>More details</p>
            </button>
          </div>
          <div className='d-flex flex-column align-items-center'>
            <a tabIndex='0' className='plain-link' target='_blank' rel='noreferrer' href='#'>
              <i className='bi bi-hover bi-play-btn-fill' aria-label='Video' />
              <p className='small'>Video guide</p>
            </a>
          </div>
          <div className='d-flex flex-column align-items-center'>
            <a tabIndex='0' className='plain-link' target='_blank' rel='noreferrer' href='https://github.com/bacpop/BacQuerya'>
              <i className='bi bi-hover bi-github' aria-label='Code (website)' />
              <p className='small'>Website code</p>
            </a>
          </div>
          <div className='d-flex flex-column align-items-center'>
            <a tabIndex='0' className='plain-link' target='_blank' rel='noreferrer' href='https://github.com/bacpop/BacQuerya-api'>
              <i className='bi bi-hover bi-github' aria-label='Code (backend)' />
              <p className='small'>API code</p>
            </a>
          </div>
          <div className='d-flex flex-column align-items-center'>
            <a tabIndex='0' className='plain-link' target='_blank' rel='noreferrer' href='https://github.com/bacpop/BacQuerya-processing'>
              <i className='bi bi-hover bi-github' aria-label='Code (backend)' />
              <p className='small'>Backend code</p>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={moreInfoRef}
        className='mx-3 mb-5'
      >
        <span className='d-block'>
          <strong className='d-block my-3'>Isolate search</strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                Search through a flexible index of samples and their metadata:
                <ul>
                  <li>An accession ID associated with isolate in external databases
                    (e.g. NCBI BioSample, ENA numbers, other sample name, GCF number).</li>
                  <li>A species (e.g. <em>Streptococcus pneumoniae</em> or <em>E coli</em>).</li>
                  <li>A country name (e.g. Nepal).</li>
                  <li>A strain or serotype name.</li>
                </ul>
                <p>You can search as with a search engine, tolerating mispellings
                  and combining terms (e.g. 'streptococcus pnuemoniae nepal 23F').
                </p>

                <p>Results are returned ordered by match to your query. Within
                  this, we try to return 'high quality' samples such as reference
                  sequences or those with uncontaminated assemblies at the top
                  of the results.
                </p>
              </span>
            </li>
            <li>
              <strong>Filtering</strong>
              <span className='d-block'>
                <p>
                  You can filter the results directly using the provided toggles,
                  search again after adjusting them.
                  Select 'exact matches' to remove any 'fuzzy' matches to your query.
                </p>
              </span>
            </li>
            <li>
              <strong>Downloading sequences</strong>
              <span className='d-block'>
                <p>
                  You can get the download links for results by clicking
                  'Download all sequences'.
                  Above 100 sequences, this will be sent by email, or after a
                  short wait.
                </p>

                <p>
                  <em>This is a work in progress, and we will add more
                    functionality to get data out of BacQuerya in the near future.
                  </em>
                </p>
              </span>
            </li>
            <li>
              <strong>Isolate Overview</strong>
              <span className='d-block'>
                <p>
                  Clicking on an individual search result will open an isolate
                  overview page, summarising available metadata for that isolate.
                  These include: the species, accession IDs linked to external
                  databases, download links for assemblies or read sets if
                  available, metadata retrieved from the NCBI BioSample database
                  and additional metadata extracted from other information sources.
                  A JSON file with this metadata can be downloaded.
                </p>

                <h6><em>For enhanced species</em></h6>
                <ul>
                  <li>Assembly statistics, and histograms of these in the species.</li>
                  <li>Contaimination, as measured by <a
                    tabIndex='0'
                    target='_blank'
                    href='https://genomebiology.biomedcentral.com/articles/10.1186/s13059-019-1841-x'>
                      mash screen</a>
                    .</li>
                  <li>A searchable list of genes (see below).</li>
                </ul>
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Genes <em>(enhanced species only)</em></strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                Search through a flexible index of clusters of orthologous genes:
                <ul>
                  <li>A gene name or alias.</li>
                  <li>Annotated gene function.</li>
                </ul>
                <p>Gene cluster have been defined using <a
                  tabIndex='0'
                  target='_blank'
                  href='https://genomebiology.biomedcentral.com/articles/10.1186/s13059-020-02090-4'>
                    panaroo</a>
                  .</p>
              </span>
            </li>
            <li>
              <strong>Gene Overview</strong>
              <span className='d-block'>
                <p>
                  Clicking on a result will open a gene overview page,
                  summarising metadata for the gene of interest.
                  The 'Names/Aliases' field displays all publicly
                  seen gene identifiers for this gene and the 'Description(s)'
                  all publicly seen functional annotations.
                </p>
                <p>
                  Population level information includes gene count and frequency,
                  and a sequence alignment viewer (rendered as an image). This can be
                  scaled to get an overview of the amount and position of variation,
                  and only SNP sites selected. This alignment currently includes one sample
                  from each strain (as defined by <a
                    tabIndex='0' target='_blank'
                    href='https://genome.cshlp.org/content/29/2/304'>PopPUNK</a>).
                </p>
                <p>
                  An inverse lookup table of isolates with this gene in this species is shown below,
                  similar to the top level isolate results.
                </p>
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Sequence <em>(enhanced species only)</em></strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                <p>
                  Genes can also be searched through using a nucleotide
                  sequence query. Search sequences must be at nucleotides &gt;=31bp long
                  (as the index was built with 31-mers).
                </p>

                <p>
                  Sequences are queried using a <a tabIndex='0'
                  target='_blank'
                  href='https://link.springer.com/chapter/10.1007/978-3-030-32686-9_21'>
                    COBS
                  </a> index
                  by exact k-mer matching. Search results are ranked in descending
                  order by the proportion of matching k-mers between the query
                  sequence and the sequence of the indexed gene and search
                  results link to the gene overview pages.
                </p>
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Study</strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                <p>
                  Studies can be searched by selecting the 'Study' tab and
                  searching for a title, author, DOI or study topic. Presently this
                  is an interface to PubMed search, so has the same features and results.
                </p>
              </span>
            </li>
            <li>
              <strong>Study Overview</strong>
              <span className='d-block'>
                <p>
                  Clicking on a search result will load the metadata for that study,
                  retrieved using the <a
                    tabIndex='0'
                    href='https://www.crossref.org/documentation/retrieve-metadata/rest-api/'
                  >
                    CrossRef API
                  </a>).
                </p>
              </span>
            </li>
            <li>
              <strong>Submitting Supplementary Data <em>(in development)</em></strong>
              <span className='d-block'>
                BacQuerya will eventually be expanded to link studies and the isolates
                they contain (and vice-versa). This is not yet automated, but if you'd
                like to help, you can submit lists of isolate accessions for returned
                studies.
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Authors and Contributors</strong>
              <span className='d-block'>
                <p>
                  <a href='https://github.com/johnlees' >Dr John Lees</a>, 
                  <a href='https://github.com/Danderson123' >Daniel Anderson</a>, and 
                  <a href='https://github.com/bruhad-dave' >Bruhad Dave</a>
                </p>
              </span>
            <li></li>
        </span>
      </div>
    </div>
  )
}

const Header = () => {
  const [aboutVisible, setAboutVisible] = useState(false)
  const toggleVisibility = () => {
    setAboutVisible(!aboutVisible)
    try {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      })
    } catch (error) {
      window.scrollTo(0, 0)
    }
  }
  return (
    <header>
      <div
        className={`container mb-1 pt-2 d-flex justify-content-between align-items-center bg-white ${
          aboutVisible ? 'sticky-top' : ''
        }`}
      >
        <h1>
          <a href='/'>
            <img
              {...{ 'aria-labelledby': 'BacQuerya' }}
              src='/logo.svg'
              alt='BacQuerya'
              title='BacQuerya'
              style={{
                width: '400px'
              }}
            />
          </a>
        </h1>
        <button className='btn btn-light m-2' onClick={toggleVisibility}>
          About
        </button>
      </div>
      <AboutContent visible={aboutVisible} />
    </header>
  )
}

export default Header
