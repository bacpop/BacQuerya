import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GeneDisplay(props) {
    const [searched, setSearched] = useState(false)
    const [isolateLinks, updateIsolateLinks] = useState();

    const renderDescriptions = results =>
      results.map(result => <li>{result}</li>)

    console.log(props.geneInfo)

    const renderIsolateLinks = results =>
      results.map((result, index) => {
        return <li key={index}>Isolate: <Link to={"/search"}>{props.geneInfo.foundIn_labels[index]}</Link> Sequence: {props.geneInfo.annotatedIn_sequences[index]}</li>
      });

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