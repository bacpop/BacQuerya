import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GeneDisplay(props) {
    const [searched, setSearched] = useState(false)
    const [isolateLinks, updateIsolateLinks] = useState();

    const renderDescriptions = results =>
      results.map(result => <li>{result}</li>)

    const searchURL = process.env.REACT_APP_API_URL + "/sparc_isolate_index/_search"
    const apiKey = process.env.REACT_APP_API_KEY

    function isolateURL(label) {
      const obj =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({"query" : {"match": {"isolateName": label.replace("_", " ")}}})
        };
      fetch(searchURL, obj).then((response) => {
        if(response.ok) {
            return response.json();
        }})
        .then((json) => {
          return json.hits.hits[0]._source.BioSample;
        });
      };

    async function tj_customer_name(label) {
      const obj =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({"query" : {"match": {"isolateName": label.replace("_", " ")}}})
        };
      const response = await fetch(searchURL, obj);
      const json = await response.json();
      return json.hits.hits[0]._source.BioSample;
    }

    console.log(props.geneInfo)

    const renderIsolateLinks = results =>
      results.map((result, index) => {
          //return <li key={index}>Isolate: <Link to={"/search/" + biosample}>{props.geneInfo.foundIn_labels[index]}</Link><p>Sequence: {props.geneInfo.foundIn_sequences[index]}</p></li>
          return <li key={index}>Isolate: {props.geneInfo.foundIn_labels[index]}<p>Sequence: {props.geneInfo.foundIn_sequences[index]}</p></li>
      })

    return(
        <div>
            <h5>Gene overview</h5>
            <p>Names/Aliases: {props.geneInfo.panarooNames.split("~~~").join(" ,")}</p>
            <p>Gene frequency: {props.geneInfo.panarooFrequency}%</p>
            <p>Description(s): {renderDescriptions(props.geneInfo.panarooDescriptions)}</p>
            <p>Found in isolates:</p>
            <div className="foundIn-list">
                {renderIsolateLinks(props.geneInfo.foundIn_indices)}
            </div>
        </div>
    )
};

export default GeneDisplay;