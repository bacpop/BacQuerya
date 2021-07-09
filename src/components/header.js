import React, { useEffect, useRef, useState } from 'react'
import '../CSS/header.css'

const AboutContent = ({ visible }) => {
  const [maxHeight, setMaxHeight] = useState()
  const wrapperRef = useRef()
  useEffect(() => {
    const onResize = () => {
      setMaxHeight(wrapperRef.current.getBoundingClientRect().height)
    }
    onResize()
    window.addEventListener('resize', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize, true)
    }
  }, [])
  const [detailVisible, setDetailVisible] = useState(false)
  const toggleDetail = () => {
    setDetailVisible(!detailVisible)
    console.log(detailVisible)
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
    <div
      className={`mx-3 overflow-hidden ${visible ? 'mb-5' : ''}`}
      style={{
        transitionDuration: '500ms',
        maxWidth: '60rem',
        maxHeight: visible ? `${maxHeight}px` : '0'
      }}
    >
      <div ref={wrapperRef}>
        <span className='d-block'>
          <p className="lead font-thin">Search for isolate names (ENA, SRA), species, metadata (country,
          serotype) or any combination of the above, flexibly.</p>

          <div className="font-weight-light">
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

        <div className="container d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex flex-column align-items-center">
            <a className="plain-link" onClick={toggleDetail}>
            <i className="bi bi-hover bi-file-earmark-text-fill" aria-label="Video"></i>
            <p className="small">More details</p>
            </a>
          </div>
          <div className="d-flex flex-column align-items-center">
            <a className="plain-link" target="_blank" href="#">
            <i className="bi bi-hover bi-camera-reels-fill" aria-label="Video"></i>
            <p className="small">Video guide</p>
            </a>
          </div>
          <div className="d-flex flex-column align-items-center">
            <a className="plain-link" target="_blank" href="https://github.com/bacpop/BacQuerya">
            <i className="bi bi-hover bi-github" aria-label="Code (website)"></i>
            <p className="small">Website code</p>
            </a>
          </div>
          <div className="d-flex flex-column align-items-center">
            <a className="plain-link" target="_blank" href="https://github.com/bacpop/BacQuerya-api">
            <i className="bi bi-hover bi-github" aria-label="Code (backend)"></i>
            <p className="small">API code</p>
            </a>
          </div>
          <div className="d-flex flex-column align-items-center">
            <a className="plain-link" target="_blank" href="https://github.com/bacpop/BacQuerya-processing">
            <i className="bi bi-hover bi-github" aria-label="Code (backend)"></i>
            <p className="small">Backend code</p>
            </a>
          </div>
        </div>
      <div
      className={`mx-3 overflow-hidden ${detailVisible ? 'mb-5' : ''}`}
      style={{
        transitionDuration: '500ms',
        maxWidth: '60rem',
        maxHeight: detailVisible ? `${maxHeight}px` : '0'
      }}
      >
        <span className='d-block'>
          <strong className='d-block my-3'>Isolates</strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                Users choose to search through isolates by selecting the
                "Isolate" tab on the BacQuerya landing page (
                <a href='www.bacquerya.com'>www.bacquerya.com</a>
                )
                and searching for an isolate identifier.
                This may be an accession ID associated with isolate in external
                websites (e.g. BioSample accessions IDs), a species
                (e.g. Streptococcus pneumoniae) or a sampling country (e.g. Nepal).
                The first 100 search results are displayed by default and an
                additional 100 results are displayed by scrolling to the
                bottom of the search page.
              </span>
            </li>
            <li>
              <strong>Filtering</strong>
              <span className='d-block'>
                Users can choose to apply filters to the search results.
                These include whether to show isolates with available assemblies,
                reads or both, isolates sample from a certain country or range
                of years, the minimum N50 for assemblies and the maximum number
                of contigs for assemblies.
              </span>
            </li>
            <li>
              <strong>Downloading sequences</strong>
              <span className='d-block'>
                Users may also download up to 100 genomic sequences by filtering
                through isolate search results and clicking "Download all sequences".
                Above 100 sequences, a text file listing the sequence URLs for the
                requested isolates is served instead.
              </span>
            </li>
            <li>
              <strong>Isolate Overview</strong>
              <span className='d-block'>
                Clicking on an individual search result will open an isolate
                overview page, summarising available metadata for that isolate.
                These include: the species, accession IDs linked to external
                databases, download links for assemblies or read sets if
                available, metadata retrieved from BioSample, additional metadata
                extracted from other information sources, pre-calculated assembly
                statistics (when an assembly is available) and genes identified
                in the assembly using population reference graphs constructed
                using Panaroo (Tonkin-Hill G, MacAlasdair N, Ruis C, Weimann A,
                Horesh G, Lees JA, et al. Producing polished prokaryotic
                pangenomes with the Panaroo pipeline. Genome biology.
                2020; 21 (1): 1-180.
                Available from: doi: 10.1186/s13059-020-02090-4).
                Bar charts are used to highlight how the assembly statistics
                for this isolate compare to the rest of the population of
                isolates in our databases.
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Genes</strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                Users can search through genes by selecting the "Gene" tab
                and entering a search term that may be a gene name or protein
                function.
              </span>
            </li>
            <li>
              <strong>Gene Overview</strong>
              <span className='d-block'>
                Clicking on a result will open a gene overview page,
                summarising metadata for the gene of interest, as identified
                by Panaroo. The "Names/Aliases" field displays all publicly
                seen gene identifiers for this gene and the "Description(s)"
                all publicly seen functional annotations. Population reference
                graphs are at the core of the BacQuerya gene identification
                pipeline, so these pages also display the frequency of the
                gene in the isolates in our databases. This page also includes
                an interactive multiple sequence alignment to summarise the
                variation of the gene sequence across the population. As
                BacQuerya currently only supports Streptococcus pneumoniae,
                this alignment includes 1 representative sequence per GPSC,
                with GPSCs assigned by the Global Pneumococcal Sequencing Project
                (<a href='https://www.pneumogen.net/gps/'>https://www.pneumogen.net/gps/</a>).
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Sequence</strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                Genes can also be searched through or identified by nucleotide
                sequence by selecting the "Sequence" tab. Sequences are
                identified using a COBS index (Bingmann T, Bradley P, Gauger F,
                Iqbal Z. COBS: a Compact Bit-Sliced Signature Index. String
                Processing and Information Retrieval. 2019; 11811 285-303)
                by k-mer matching. Search results are ranked in descending
                order by the proportion of matching k-mers between the query
                sequence and the sequence of the indexed gene and search
                results link to the gene overview pages. Sequence queries
                must be at least 31 characters long and contain only
                "A", "C", "T" and "G" characters.
              </span>
            </li>
          </ul>
          <strong className='d-block mb-3'>Study</strong>
          <ul>
            <li>
              <strong>Searching</strong>
              <span className='d-block'>
                Studies can be searched by selecting the "Study" tab and
                searching for a title, author, DOI or study topic. Queries
                are searched for in PubMed using Biopython (Cock PJA, Antao T,
                Chang JT, Chapman BA, Cox CJ, Dalke A, et al. Biopython:
                freely available Python tools for computational molecular
                biology and bioinformatics. Computer applications in the
                biosciences. 2009; 25 (11): 1422-1423).
              </span>
            </li>
            <li>
              <strong>Study Overview</strong>
              <span className='d-block'>
                Clicking on a search result will load the metadata for that study,
                retrieved using the CrossRef API (
                <a
                  href='https://www.crossref.org/documentation/retrieve-metadata/rest-api/'
                >
                  https://www.crossref.org/documentation/retrieve-metadata/rest-api/
                </a>).
              </span>
            </li>
            <li>
              <strong>Submitting Supplementary Data **Currently in Beta**</strong>
              <span className='d-block'>
                There is currently no standardisation for or way to
                programmatically access a list of isolates used in a particular
                study. This may lead to a duplication of effort or time wasted
                while attempting to locate the metadata for these isolates.
                We would like to make this process easier by making the metadata
                for these isolates immediately available on our study overview
                pages. We currently do not have the capacity to automate this
                process however, we have set up a framework for volunteers to
                submit the accession IDs associated with a study in the hopes
                of improving the efficiency of this process for everyone.
                This submission portal is available through the study overview
                pages.
              </span>
            </li>
          </ul>
          <span className='d-block'>All source code is available from:</span>
          <ul>
            <li>
              <a
                href='https://github.com/bacpop/BacQuerya'
              >
                https://github.com/bacpop/BacQuerya
              </a>
            </li>
            <li>
              <a
                href='https://github.com/bacpop/BacQuerya-api'
              >
                https://github.com/bacpop/BacQuerya-api
              </a>
            </li>
            <li>
              <a
                href='https://github.com/bacpop/BacQuerya-processing'
              >
                https://github.com/bacpop/BacQuerya-processing
              </a>
            </li>
          </ul>
        </span>
      </div>
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
