import { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';

import IsolateDisplay from '../displayPages/isolateDisplay'
import { specificIsolateQuery } from '../indexQuerying/isolateQuery'

const IsolatePage = ({ match }) => {
    const {
        params: { BioSample },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    useEffect(() => {
        specificIsolateQuery([].concat(BioSample)).then((responseJson) => {
            updateResult(responseJson[0]._source)
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