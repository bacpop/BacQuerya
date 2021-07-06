import { useState, useEffect } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { Link } from 'react-router-dom'
import xss from 'xss'

import KeyVals from '../common/KeyVals.js'

function StudyDisplay ({ studyInfo }) {
  const [openCitaitonsResult, setOpenCitations] = useState()

  useEffect(() => {
    window.fetch(`https://api.crossref.org/works/${studyInfo.DOI}`).then((response) => response.json()).then((responseJson) => {
      setOpenCitations(responseJson.message)
    })
  }, [studyInfo, setOpenCitations])

  function cleanAbsract (string) {
    const recordArray = string.split((/[>,<]+/))
    for (let i = 0; i < recordArray.length; i++) {
      if (recordArray[i].indexOf('jats') > -1 || recordArray[i].indexOf('Abstract') > -1) {
        recordArray[i] = ''
      }
    }
    return recordArray
  };

  return (
    <div className='container text-start text-left pb-4'>
      {
        openCitaitonsResult
          ? (
            <>
              <h1
                className='max-w-readable mb-4'
                dangerouslySetInnerHTML={{
                  __html: xss(studyInfo.Title)
                }}
              />
              <KeyVals
                items={[
                  ['Authors', studyInfo.AuthorList.join(', ')],
                  ['Journal name', studyInfo.FullJournalName],
                  ['Volume', studyInfo.Volume],
                  ['Issue', studyInfo.Issue],
                  ['Page(s)', studyInfo.Pages],
                  ['Received', studyInfo.History.received],
                  ['Accepted', studyInfo.History.accepted],
                  ['ePub Date', studyInfo.EPubDate],
                  [
                    'DOI',
                    studyInfo.DOI && (
                      <a
                        href={`https://dx.doi.org/${studyInfo.DOI}`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {studyInfo.DOI}
                      </a>
                    )

                  ],
                  ['PMC ID', studyInfo.ArticleIds.pmc],
                  ['PubMed ID', studyInfo.ArticleIds.pubmed[0]],
                  ['RID', studyInfo.ArticleIds.rid]
                ]}
              />
              <div className='mt-4'>
                <strong>View study at source:</strong>
                <div>
                  <a href={openCitaitonsResult.URL} target='_blank' rel='noreferrer'>{openCitaitonsResult.URL}</a>
                </div>
              </div>
              <div className='mt-2'>
                <strong>Download study:</strong>
                <div>
                  <a href={openCitaitonsResult.link[0].URL} target='_blank' rel='noreferrer'>{openCitaitonsResult.link[0].URL}</a>
                </div>
              </div>
              {
                openCitaitonsResult.abstract && (
                  <p className='mt-5 max-w-readable'>{cleanAbsract(openCitaitonsResult.abstract)}</p>
                )
              }
              <Link
                className='mt-4 btn btn-secondary'
                to={'/submit/' + studyInfo.encodedDOI}
                target='_blank'
              >
                Click to submit the accession IDs of isolates used in this study
              </Link>
            </>
            )
          : (
            <>
              <Spinner animation='border' variant='primary' />
            </>
            )
      }
    </div>
  )
};

export default StudyDisplay
