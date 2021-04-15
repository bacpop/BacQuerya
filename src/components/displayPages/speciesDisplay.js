import { Link } from "react-router-dom";

import Paginate from "../paginateResults.js"
import "../../CSS/speciesDisplay.css"

function SpeciesDisplay(props) {
  //map array of search results to an intepretable output
  if (props.speciesInfo) {
    var resultsRendered = props.speciesInfo.map((result, index)=> {
        if (result._source!== undefined) {
            return (
                <p key={index}>
                    <Link to={"/isolate/" + props.genus + "/" + props.species + "/" + result._source.BioSample}>
                        {result._source.BioSample}
                    </Link>
                </p>
    )}});
  };
  return (
    <div>
      <>
      <div className="speciesDisplay-endpoint">
        <p style={{display: "inline-block"}}> > </p>
        <Link style={{display: "inline-block"}} to={"/isolate/" + props.genus}>{props.genus}</Link>
        <p style={{display: "inline-block"}}> > </p>
        <Link style={{display: "inline-block"}} to={"/isolate/" + props.genus + "/" + props.species}>{props.species}</Link>
      </div>
      {(resultsRendered) &&
        <div className="species-pagination">
          <Paginate resultNumber={30} resultsRendered={resultsRendered} queryType="speciesContained"/>
        </div>}
      </>
    </div>
    );
  };

export default SpeciesDisplay;