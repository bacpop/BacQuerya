import { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';

import IsolateDisplay from '../displayPages/isolateDisplay'

const IsolatePage = ({ match }) => {
    const {
        params: { Genus, Species, BioSample },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    const searchURL = process.env.REACT_APP_API_URL + "/sparc_isolate_index/_search"
    const apiKey = process.env.REACT_APP_API_KEY

    const obj =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({"query" : {"match": {"BioSample": BioSample}}})
        };

    useEffect(() => {
        fetch(searchURL, obj).then((response) => response.json()).then((responseJson) => {
            updateResult(responseJson.hits.hits[0]._source)
            setSearched(true)
            },
            );
      }, [updateResult, setSearched]);
      return (
        <div className="search_results">
            {searched === true &&
                <div>
                    <IsolateDisplay isolateInfo={searchResult} />
                </div>
            }
            {searched === false &&
                <div>
                    <Spinner animation="border" variant="primary" />
                </div>
            }
        </div>
    );
  };

export default IsolatePage;