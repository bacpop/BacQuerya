import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import "../CSS/sequenceDownload.css"

async function postSequenceUrls(sequenceURLs, email) {
    const fetchData =  {
      method: 'POST',
      mode: 'cors',
      headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'sequenceURLs': sequenceURLs, 'email': email}),
    };
    const fetchResponse = await fetch("https://bacquerya.azurewebsites.net:443/bulkdownloads", fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse
  };

export function SequenceDownload(props) {

    function submitDownload(e) {
        e.preventDefault()
        postSequenceUrls(props.sequenceURLs, e.target.enteredEmail.value).then(result => {
            console.log(result)
        });
    };

    return (
        <div>
            <>
                <div className="downLoadOptions-close" id="downloadOptions-close-font" onClick={() => props.setOpenDownloads(false)}>
                    X
                </div>
                <Form className="downloadOptions-contents" onSubmit={submitDownload}>
                    <Form.Label className="download-container-text">For large numbers of sequences, we recommend sharing your email so you can be contacted when your sequences are available for download (your email will not be used for any other purpose).</Form.Label>
                    <Form.Control className="download-container-email" name="enteredEmail" value={props.emailValue} onChange={e => props.setEmailValue(e.target.value)}/>
                    <Button className="download-container-button" variant="outline-primary" type="submit">Request sequences</Button>
                </Form>
            </>
        </div>
    );
};