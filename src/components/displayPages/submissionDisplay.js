import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SubmissionPage = ({ match }) => {
    const {
        params: { encodedDOI },
    } = match;

    console.log(encodeURI(encodedDOI))
    return(
        <div>
            <h3 id="header-font">
                Submit accession IDs for study: {decodeURIComponent(encodedDOI)}
            </h3>
            <Form onSubmit="">
                <Form.Label id="mediumLarge-font">BioSample accession</Form.Label>
                <Form.Control size="sm" name="" value="" onChange="" id="mediumLarge-font"/>
                <Form.Label id="mediumLarge-font">EBI run accesssion</Form.Label>
                <Form.Control size="sm" name="" value="" onChange="" id="mediumLarge-font"/>
                <Form.Label id="mediumLarge-font">GenBank assembly accesssion</Form.Label>
                <Form.Control size="sm" name="" value="" onChange="" id="mediumLarge-font"/>
                <Form.Label id="mediumLarge-font">RefSeq assembly accesssion</Form.Label>
                <Form.Control size="sm" name="" value="" onChange="" id="mediumLarge-font"/>
                <Button variant="outline-primary" type="submit" id="mediumLarge-font">Submit accession IDs</Button>
            </Form>
            <div>
                + Add row
            </div>
        </div>
    );
  };

  export default SubmissionPage;
