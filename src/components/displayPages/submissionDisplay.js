import {useState, useCallback} from 'react';
import Button from 'react-bootstrap/Button';

import { assignStudyAccessions } from '../indexQuerying/studyQuery'
import DropZone from '../templateUploader'
import '../../CSS/submissionDisplay.css'

const SubmissionPage = ({ match }) => {
    const {
        params: { encodedDOI },
    } = match;

    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const decodedDOI = decodeURIComponent(encodedDOI);

    const validateUpload = (upload, DOI) => {
        if (upload[0].name.replace(".csv", "") == DOI.replace("/", ":")) {
            return "valid"
        };
        if (upload[0].name.replace(".csv", "") != DOI.replace("/", ":") + ".csv") {
            return "Incorrect filename"
        };
        if (upload[0].name.indexOf(".csv") === -1) {
            return "Incorrect filetype"
        };
    };

    // check the uploaded file is named as the DOI and is a csv
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles)
        const validated = validateUpload(acceptedFiles, decodedDOI);
        if (validated === "valid") {
            setSuccess(true)
            assignStudyAccessions(acceptedFiles[0])
        } else{
            setFailure(validated)
        };
    }, [validateUpload, setSuccess, setFailure, decodedDOI]);

    return(
        <div style={{ width: "100%", height: "100%"}}>
            {(success === false && failure === false) &&
                <>
                <h3 id="header-font" style={{marginTop: "1%"}}>
                    Submit accession IDs for study: {decodedDOI}
                </h3>
                <p style={{textAlign: "left", marginTop: "1%", marginLeft: "3%", marginRight: "3%"}}>
                    It is difficult to standardise supplementary information for studies and as a result, there is currently no way to programatically access this information. BacQuerya wants to make this easier by linking studies to the genomic information of isolates used in the investigation. Therefore, this page allows users to upload the accession IDs of isolates specified in the supplementary information for the study with DOI: {decodeURIComponent(encodedDOI)}.
                </p>
                <p style={{textAlign: "left", marginTop: "1%", marginLeft: "3%", marginRight: "3%"}}>
                    To submit accessions, please complete the "upload_template.csv" file below, completing ONE field per row, with ONE row per isolate. When you are done, save the completed template as a CSV file titled "{decodedDOI}.csv" and upload it using the drag and drop uploader below. When you are ready to submit, click "Submit accession IDs". If the accession IDs are included in our databases, the information will automatically be linked to the study and presented on the study overview page.
                </p>
                <Button style={{float: "right", marginRight: "4%"}} variant="outline-primary" type="submit" id="mediumLarge-font" href="http://127.0.0.1:5000/upload_template">Click to download the upload template</Button>
                <DropZone onDrop={ onDrop } DOI={ decodedDOI }/>
                </>}
            {(success) && <h3 id="header-font" style={{marginTop: "2%"}}>Thank you for your submission!</h3>}
            {(failure) && <h3 id="header-font" style={{marginTop: "2%"}}>{failure}. The filename should be "{decodedDOI}.csv". Please refresh the page and try again.</h3>}
        </div>
    );
  };

  export default SubmissionPage;
