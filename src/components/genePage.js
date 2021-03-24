import { useState, useEffect } from "react";

import GeneDisplay from './displayPages/geneDisplay'

const GenePage = ({ match }) => {
    const {
        params: { geneName },
        } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    const searchURL = process.env.REACT_APP_API_URL + "/sparc_gene_index/_search"
    const apiKey = process.env.REACT_APP_API_KEY

    const obj =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({"query" : {"match": {"panarooNames": geneName}}})
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
                    <GeneDisplay geneInfo={searchResult} />
                </div>
            }
        </div>
    );
  };

export default GenePage;