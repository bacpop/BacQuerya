import { Link } from "react-router-dom";

import Paginate from '../paginateResults';
import "../../CSS/geneDisplay.css"

function GeneDisplay(props) {

    const renderDescriptions = results =>
      results.map(result => <li>{result}</li>)

    console.log(props.geneInfo)

    const divideSequence = sequence => {
      return(sequence.match(/.{1,130}/g).map((result, index) => {
        return (
          <p key={index}>
            {result}
          </p>
      )}))
    };

    //map array of search results to an intepretable output
    if (props.geneInfo.foundIn_indices) {
      var resultsRendered = props.geneInfo.foundIn_indices.map((result, index)=> {
          if (result !== undefined) {
              return (
                <div className="isolateItem">
                    <Link className="isolateResult-align" to={"/streptococcus/pneumoniae/" + props.geneInfo.foundIn_biosamples[index]} target="_blank">
                      {props.geneInfo.foundIn_labels[index]}
                    </Link>
                    <p className="sequenceResult-align" id="sequenceResult-align-font">
                      {divideSequence(props.geneInfo.foundIn_sequences[index])}
                    </p>
                </div>
      )}});
    };
    return(
        <div>
          <>
            <div>
              <h3>Gene overview</h3>
              <p>Names/Aliases: {props.geneInfo.panarooNames.split("~~~").join(" ,")}</p>
              <p>Gene frequency: {props.geneInfo.panarooFrequency}%</p>
              <p>Description(s): {renderDescriptions(props.geneInfo.panarooDescriptions)}</p>
              <p>Found in isolates:</p>
            </div>
            {(resultsRendered) && <div>
                <Paginate resultNumber={20} resultsRendered={resultsRendered} queryType="sequencesContained"/>
            </div>}
          </>
        </div>
    )
};

export default GeneDisplay;