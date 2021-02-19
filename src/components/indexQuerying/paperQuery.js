import {useState, useEffect} from 'react';
import '../../App.css';

function PaperQuery(props) {

    const [searchResult, updateResult] = useState();

    useEffect(() => {
        fetch("https://cors-anywhere.herokuapp.com/https://w3id.org/oc/index/coci/api/v1", {
            method: 'POST',
            mode: 'cors',
            headers : {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: {'citing': "10.1186/1756-8722-6-59"},
            }).then((response) => {
            //.then((response) => response.json()).then((responseJson) => {
          //const paperJSON = JSON.parse(responseJson);
          console.log(response)
      });
    }, [updateResult]);

    return (
        <div className="search_results">
        </div>
    );
};

export default PaperQuery;