import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';

import speciesQuery from '../indexQuerying/speciesQuery'
import SpeciesDisplay from '../displayPages/speciesDisplay'

const SpeciesPage = ({ match }) => {
    const {
        params: { Genus, Species },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    //call async function to search for species
    speciesQuery(Genus + " " + Species).then(result => {
        setSearched(true);
        updateResult(result);
    });
    return (
        <div className="search_results">
            {searched === true &&
                <div>
                    <SpeciesDisplay speciesInfo={searchResult} genus={Genus} species={Species}/>
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

export default SpeciesPage;