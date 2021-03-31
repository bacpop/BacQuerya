import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

function PaperQuery(props) {

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();
    const [selectedPaper, selectPaper] = useState(null);

    //useEffect(() => {
          //fetch("https://opencitations.net/index/api/v1/metadata/10.6084/m9.figshare.5915314.v2").then((response) => response.json()).then((responseJson) => {
            //console.log(responseJson)
          //});
    //}, [updateResult]);

    useEffect(() => {
      fetch('https://bacquerya.azurewebsites.net:443/paper', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'searchTerm': props.searchTerm, 'source': 'searchBar'}),
          }).then((response) => response.json()).then((responseJson) => {
          setSearched(true)
          updateResult(responseJson.result)
        });
    }, [updateResult]);

    const renderResult = results =>
      results.map(result =>
          <li>
              <Link to={"/paper/" + result.encodedDOI} onClick={() => selectPaper(result.encodedDOI)}>{result.Title}</Link>
          </li>
          );

  return (
    <div className="search_results">
        {(searched == false) && <Spinner animation="border" variant="primary" />}
        {(searched === true && selectedPaper === null && searchResult !== undefined) && <div>{renderResult(searchResult)}</div>}
        {(searched === true && selectedPaper === null && searchResult === undefined) && <p>No result...</p>}
    </div>
    )
};

export default PaperQuery;