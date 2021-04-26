import {useState} from 'react'
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

import Paginate from '../paginateResults';
import { specificIsolateQuery } from '../indexQuerying/isolateQuery'
import "../../CSS/geneDisplay.css"

function GeneDisplay(props) {

  const [queryResult, setQueryResult] = useState(null);

  const renderDescriptions = results =>
    results.map(result => <li>{result}</li>)

  console.log(props.geneInfo)

  const fastSequenceLinks = links =>
  links.map((link, index) => {
      return (
          <div className="readResult-fastlinks">
              {(index === 0) && <a href={link} rel="noreferrer">full</a>}
              {(index === 1) && <a href={link} rel="noreferrer">forward</a>}
              {(index === 2) && <a href={link} rel="noreferrer">reverse</a>}
          </div>
  )});

  //map array of search results to an intepretable output
  if (props.geneInfo.foundIn_biosamples) {
    specificIsolateQuery(props.geneInfo.foundIn_biosamples).then(response => {
      setQueryResult(response)
    });
  };

  if (queryResult) {
    var resultsRendered = queryResult.map((result)=> {
        return (
          <div className="isolate-returned">
            <>
            <div className="isolate-link">
                <Link className="isolate-link-biosample" to={"/isolate/streptococcus/pneumoniae/" + result._source.BioSample} target="_blank">{result._source.BioSample}</Link>
                <div className="isolate-link-organismname">
                    {result._source.Organism_name}
                </div>
                <div className="isolate-link-genomerepresentation">
                    {result._source.Genome_representation}
                </div>
                <div className="isolate-link-sequencecount">
                {(result._source.contig_stats) && <div>
                    {result._source.contig_stats.sequence_count}
                </div>}
                </div>
                <div>
                    { (typeof result._source.sequenceURL === 'string') && <div className="isolate-link-assembly-sequenceURL"><a href={result._source.sequenceURL} rel="noreferrer"> {result._source.sequenceURL.split("/")[result._source.sequenceURL.split("/").length - 1]} </a></div>}
                    { (Array.isArray(result._source.sequenceURL) === true) && <div className="isolate-link-read-sequenceURL"> {fastSequenceLinks(result._source.sequenceURL)}</div> }
                </div>
            </div>
            </>
          </div>
      )});
    };

    return(
        <div>
          { (resultsRendered) &&
            <>
              <div>
                <h3 id="header-font">Gene overview</h3>
                <p id="mediumLarge-font">Names/Aliases: {props.geneInfo.panarooNames.split("~~~").join(", ")}</p>
                <p id="mediumLarge-font">Gene frequency: {props.geneInfo.panarooFrequency}%</p>
                <p id="mediumLarge-font">Description(s): {renderDescriptions(props.geneInfo.panarooDescriptions)}</p>
                <div className="isolateGenes-info">
                  <div className="isolateGeneCount" id="medium-font">
                    Gene was found in {resultsRendered.length} isolates
                  </div>
                  <div className="msa-button" id="mediumLarge-font">
                    Click to download multiple sequence alignment
                  </div>
                </div>
              </div>
              <Paginate resultNumber={25} resultsRendered={resultsRendered} queryType="isolatesContained"/>
            </>}
          {(resultsRendered === undefined) && <Spinner animation="border" variant="primary" />}
        </div>
    )
};

export default GeneDisplay;