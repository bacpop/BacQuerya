import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import '../../CSS/submissionDisplay.css'
const SubmissionPage = ({ match }) => {
    const {
        params: { encodedDOI },
    } = match;

    const [rowCount, setRowCount] = useState(1);

    function addRow() {
        setRowCount(rowCount + 1)
    };

    function subtractRow() {
        setRowCount(rowCount - 1)
    };

    var renderedRows = []
    var i
    for (i = 0; i < rowCount; i++) {
        renderedRows.push(
            <div className="submission-line" key={i}>
                <div className="submisson-label-container">
                    <Form.Label className="submission-label" id="mediumLarge-font">BioSample accession</Form.Label>
                    <Form.Label className="submission-label" id="mediumLarge-font">EBI run accesssion</Form.Label>
                    <Form.Label className="submission-label" id="mediumLarge-font">GenBank assembly accesssion</Form.Label>
                    <Form.Label className="submission-label" id="mediumLarge-font">RefSeq assembly accesssion</Form.Label>
                </div>
                <div className="submisson-input-container">
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={"biosample_" + i} defaultValue="None"/>
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={"ebi_" + i} defaultValue="None"/>
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={"genbank_" + i} defaultValue="None"/>
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={"refseq_" + i} defaultValue="None"/>
                </div>
            </div>
        );
    };

    return(
        <div>
            <h3 id="header-font">
                Submit accession IDs for paper: {decodeURIComponent(encodedDOI)}
            </h3>
            <p style={{textAlign: "left", marginTop: "1%", marginLeft: "3%", marginRight: "3%"}}>
                It is difficult to standardise supplementary information for studies and as a result, there is currently no way to programatically access this information. BacQuerya wants to make this process easier by linking papers to the genomic information of isolates used in the investigation. Therefore, this page allows users to upload the accession IDs of isolates specified in the supplementary information for the paper with DOI: {decodeURIComponent(encodedDOI)}.
            </p>
            <p style={{textAlign: "left", marginTop: "1%", marginLeft: "3%", marginRight: "3%"}}>
                To submit an accession, please complete the template below, choosing ONE field per row, with ONE row per isolate, and click "Submit accession IDs". This information will then be indexed and automatically linked with the relevant paper. Please ensure all information is correct prior to submission.
            </p>
            <Form>
                {renderedRows}
                <div className="addSubmission-row" id="mediumLarge-font" onClick={() => addRow()}>
                    + Add row
                </div>
                <div className="subtractSubmission-row" id="mediumLarge-font" onClick={() => subtractRow()}>
                    - Subtract row
                </div>
                <Button className="submitAccession-button" variant="outline-primary" type="submit" id="mediumLarge-font">Submit accession IDs</Button>
            </Form>
        </div>
    );
  };

  export default SubmissionPage;
