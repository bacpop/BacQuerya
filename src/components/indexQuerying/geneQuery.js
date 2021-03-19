import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

function GeneQuery(props) {

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    useEffect(() => {
        fetch("http://localhost:5000/sequence", {
            method: 'POST',
            mode: 'cors',
            headers : {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'searchTerm': props.searchTerm}),
            }).then((response) => response.json()).then((responseJson) => {
          const sequenceResult = responseJson.resultMetrics;
          console.log(sequenceResult)
          updateResult(sequenceResult);
          setSearched(true)
      });
    }, [updateResult, setSearched]);

    const renderResult = results =>
      results.map(result =>
        <p key={result.geneName}>
          Gene: <Link to={"/gene/" + result.geneName}>{result.geneName}</Link>, Match proportion: {result.numberMatching}%
        </p>
      );

    return (
        <div className="gene-results">
          {(searched == false) && <Spinner animation="border" variant="primary" />}
          {(searched === true && searchResult.length > 0) && <div>{renderResult(searchResult)}</div>}
          {(searched === true && searchResult.length === 0) && <p>No result...</p>}
        </div>
    );
};

export default GeneQuery;