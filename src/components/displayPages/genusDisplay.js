import { Link } from "react-router-dom";

import Paginate from "../paginateResults.js"
import "../../CSS/genusDisplay.css"

function GenusDisplay(props) {
  //map array of search results to an intepretable output
  if (props.genusInfo) {
    var resultsRendered = props.genusInfo.map((result, index)=> {
        if (result !== undefined) {
            return (
                <p key={index}>
                    <Link to={"/" + props.genus + "/" + result} target="_blank">
                        {props.genus + ' ' + result}
                    </Link>
                </p>
    )}});
  };
  return (
    <div>
        <>
        <div className="genusDisplay-endpoint">
            <p style={{display: "inline-block"}}> > </p>
            <Link style={{display: "inline-block"}} to={"/" + props.genus} target="_blank">{props.genus}</Link>
        </div>
        {(resultsRendered) &&
            <div className="genus-pagination">
            <Paginate resultNumber={30} resultsRendered={resultsRendered} queryType="genusContained"/>
            </div>}
        </>
    </div>
    );
  };

export default GenusDisplay;