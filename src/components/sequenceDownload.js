import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'

async function postSequenceUrls (sequenceURLs, email) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sequenceURLs: sequenceURLs, email: email })
  }
  const fetchResponse = await window.fetch('https://bacquerya.azurewebsites.net:443/bulkdownloads', fetchData)
  const resolvedResponse = await fetchResponse.json()
  return resolvedResponse.downloadURL
};

export function SequenceDownload ({ sequenceUrls, setOpenDownloads }) {
  const [emailValue, setEmailValue] = useState('')
  const [downlinkLoading, setDownloadlinkLoading] = useState(false)
  const [downloadlink, setDownloadlink] = useState(null)

  function submitDownload (e) {
    e.preventDefault()
    setDownloadlinkLoading(true)
    postSequenceUrls(sequenceUrls, e.target.enteredEmail.value).then(result => {
      setDownloadlinkLoading(false)
      setDownloadlink(result)
    })
  };

  return (
    <div
      className='p-2'
      style={{
        fontSize: '.8rem'
      }}
    >
      <>
        <div className='d-flex justify-content-space-between'>
          <h3>
            Download
          </h3>
          <button
            className='text-right ml-auto btn btn-light btn-sm text-sm'
            style={{
              height: '30px'
            }}
            onClick={() => setOpenDownloads(false)}
          >
            X
          </button>
        </div>

        {(downlinkLoading === false && downloadlink === null) &&
          <Form onSubmit={submitDownload}>
            <Form.Label>
              We allow users to request up to 100 genomic sequences for download
              and return a download link that is live for 24 hours after submitting the request.
              You may choose to supply your email if you want this link forwarded to you
              when the sequences are available (your email will be used for no other purpose).
              Between 100 and 1000 sequences, we provide a .txt file containing download links
              to the requested sequences. These can be downloaded using tools like wget.
            </Form.Label>
            <Form.Control
              className='my-2'
              name='enteredEmail'
              value={emailValue}
              placeholder='Email address'
              onChange={e => setEmailValue(e.target.value)}
            />
            <Button
              className='mt-2'
              type='submit'
              disabled={!emailValue.trim()}
            >
              Request sequences
            </Button>
          </Form>}
        {(downlinkLoading && downloadlink === null) && (
          <div className='d-flex justify-content-center align-items-center py-4'>
            <Spinner animation='border' variant='primary' />
          </div>
        )}
        {(downlinkLoading === false && downloadlink) && (
          <a
            href={downloadlink}
            target='_blank'
            rel='noreferrer'
          >
            Your sequences have successfully been retrieved. Click here to go to the download page.
          </a>
        )}
      </>
    </div>
  )
};
