import {useState, useEffect} from 'react';
import '../../App.css';

function SequenceQuery(props) {

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
            }).then((response) => {
          console.log(response)
      });
    }, [updateResult]);

    return (
        <div className="search_results">
        </div>
    );
};

export default SequenceQuery;