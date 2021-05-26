import { useState, useEffect } from "react";

import GeneDisplay from '../displayPages/geneDisplay'
import { specificGeneQuery } from '../indexQuerying/geneQuery'

const GenePage = ({ match }) => {
    const {
        params: { geneName },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    useEffect(() => {
        specificGeneQuery([].concat(geneName)).then((responseJson) => {
            console.log(responseJson)
            updateResult(responseJson[0]._source)
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