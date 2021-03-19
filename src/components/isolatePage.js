import { useState, useEffect } from "react";

import IsolateDisplay from './displayPages/isolateDisplay'

const IsolatePage = ({ match }) => {
    const {
        params: { BioSample },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    const index = process.env.REACT_APP_ISOLATE_INDEX
    const searchURL = process.env.REACT_APP_API_URL + index + "/_search"
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
        </div>
    );
  };

export default IsolatePage;