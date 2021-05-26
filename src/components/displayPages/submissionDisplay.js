import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { assignStudyAccessions } from '../indexQuerying/studyQuery'
import '../../CSS/submissionDisplay.css'

const SubmissionPage = ({ match }) => {
    const {
        params: { encodedDOI },
    } = match;

    const [rowCount, setRowCount] = useState(1);
    const [fieldValues, setFieldValues] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const decodedDOI = decodeURIComponent(encodedDOI)

    function addRow() {
        setRowCount(rowCount + 1)
    };

    function subtractRow() {
        setRowCount(rowCount - 1)
    };

    function handleChange(e){
        const fieldName = e.target.name
        const fieldValue = e.target.value.trim()
        fieldValues[fieldName] = fieldValue
    };

    function handleSubmit(e){
        e.preventDefault()
        setSubmitted(true)
        assignStudyAccessions(fieldValues, encodedDOI, decodedDOI)
    };

    var renderedRows = []
    var i
    for (i = 0; i < rowCount; i++) {
        const biosample_name = "biosample_" + i;
        const ebi_name = "ebi_" + i;
        const genbank_name = "genbank_" + i;
        const refseq_name = "refseq_" + i;

        renderedRows.push(
            <div className="submission-line" key={i}>
                <div className="submisson-label-container">
                    <Form.Label className="submission-label" id="mediumLarge-font">BioSample accession</Form.Label>
                    <Form.Label className="submission-label" id="mediumLarge-font">EBI run accesssion</Form.Label>
                    <Form.Label className="submission-label" id="mediumLarge-font">GenBank assembly accesssion</Form.Label>
                    <Form.Label className="submission-label" id="mediumLarge-font">RefSeq assembly accesssion</Form.Label>
                </div>
                <div className="submisson-input-container">
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={biosample_name} defaultValue="None" onChange={handleChange}/>
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={ebi_name} defaultValue="None" onChange={handleChange}/>
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={genbank_name} defaultValue="None" onChange={handleChange}/>
                    <Form.Control className="submission-input" size="sm" id="mediumLarge-font" name={refseq_name} defaultValue="None" onChange={handleChange}/>
                </div>
            </div>
        );
    };

    return(
        <div>
            {(submitted === false) &&
                <>
                <h3 id="header-font" style={{marginTop: "1%"}}>
                    Submit accession IDs for study: {decodedDOI}
                </h3>
                <p style={{textAlign: "left", marginTop: "1%", marginLeft: "3%", marginRight: "3%"}}>
                    It is difficult to standardise supplementary information for studies and as a result, there is currently no way to programatically access this information. BacQuerya wants to make this easier by linking studys to the genomic information of isolates used in the investigation. Therefore, this page allows users to upload the accession IDs of isolates specified in the supplementary information for the study with DOI: {decodeURIComponent(encodedDOI)}.
                </p>
                <p style={{textAlign: "left", marginTop: "1%", marginLeft: "3%", marginRight: "3%"}}>
                    To submit an accession, please complete the template below, choosing ONE field per row, with ONE row per isolate. Additional rows can be added by clicking "Add row". When you are ready to submit, click "Submit accession IDs". This information will automatically be indexed and linked to the relevant study so please ensure all information is correct prior to submission.
                </p>
                <Form onSubmit={handleSubmit}>
                    {renderedRows}
                    <div className="addSubmission-row" id="mediumLarge-font" onClick={() => addRow()}>
                        + Add row
                    </div>
                    <div className="subtractSubmission-row" id="mediumLarge-font" onClick={() => subtractRow()}>
                        - Subtract row
                    </div>
                    <Button className="submitAccession-button" variant="outline-primary" type="submit" id="mediumLarge-font">Submit accession IDs</Button>
                </Form>
                </>}
            {(submitted) && <h3 id="header-font" style={{marginTop: "2%"}}>Thank you for your submission!</h3>}
        </div>
    );
  };

  export default SubmissionPage;
