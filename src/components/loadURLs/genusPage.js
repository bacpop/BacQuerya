import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';

import GenusDisplay from '../displayPages/genusDisplay'

const GenusPage = ({ match }) => {
    const {
        params: { Genus },
    } = match;

    const [searched, setSearched] = useState(true)
    const [searchResult, updateResult] = useState(["pneumoniae"]);

    return (
      <div className="search_results">
            {searched === true &&
                <div>
                    <GenusDisplay genus={Genus} genusInfo={searchResult}/>
                </div>
            }
            {searched === false &&
                <div>
                    <Spinner className="mb-3" animation="border" variant="primary" />
                </div>
            }
        </div>
    );
  };

export default GenusPage;