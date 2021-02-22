import {useState, useEffect} from 'react';
import '../../App.css';

function SequenceQuery(props) {

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
          const sequenceResult = responseJson.sequenceResult;
          console.log(sequenceResult)
          updateResult(sequenceResult);
          setSearched(true)
      });
    }, [updateResult, setSearched]);

    const renderResult = results =>
      results.map(result => <p key={result.index}>{result[1]}</p>);

    return (
        <div className="search_results">
          {(searched === true && searchResult.length > 0) && <ul>{renderResult(searchResult)}</ul>}
          {(searched === true && searchResult.length === 0) && <p>No result...</p>}
        </div>
    );
};

export default SequenceQuery;