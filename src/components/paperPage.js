import { useState, useEffect } from "react";

import PaperDisplay from './displayPages/paperDisplay'

const PaperPage = ({ match }) => {
    const {
        params: { encodedDOI },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    useEffect(() => {
        fetch('https://bacquerya.azurewebsites.net:443/paper', {
            method: 'POST',
            mode: 'cors',
            headers : {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'searchTerm': encodedDOI, 'source': 'URL'}),
            }).then((response) => response.json()).then((responseJson) => {
                updateResult(responseJson.result[0])
                setSearched(true)
          });
      }, [updateResult, setSearched]);

      return (
        <div className="search_results">
            {searched === true &&
                <div>
                    <PaperDisplay paperInfo={searchResult} />
                </div>
            }
        </div>
    );
  };

export default PaperPage;