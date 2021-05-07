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

    var splitGeneNames= [props.geneInfo.consistentNames];
    var splitNames = props.geneInfo.panarooNames.split("~~~");
    for (var i = 0; i < splitNames.length; i++) {
        if (splitNames[i].indexOf("UNNAMED_") === -1 && splitNames[i].indexOf("PRED_") === -1) {
          splitGeneNames.push(splitNames[i])
        };
    };

    return(
        <div>
          { (resultsRendered) &&
            <>
              <div>
                <h3 id="header-font">Gene overview</h3>
                  <>
                  <h4>Annotation assigned by Panaroo</h4>
                  <p id="mediumLarge-font">Names/Aliases: {splitGeneNames.join(", ")}</p>
                  <p id="mediumLarge-font">Gene frequency: {props.geneInfo.panarooFrequency}%</p>
                  <p id="mediumLarge-font">Description(s): {renderDescriptions(props.geneInfo.panarooDescriptions)}</p>
                  {(props.geneInfo.pfam_names) &&
                    <>
                    <h4>Annotation assigned by Pfam</h4>
                    <p id="mediumLarge-font">Names/Aliases: {[props.geneInfo.pfam_names].join(", ")}</p>
                    <p id="mediumLarge-font">Description(s): {[props.geneInfo.pfam_descriptions].join(", ")}</p>
                    <p id="mediumLarge-font">Accession(s): {[props.geneInfo.pfam_accessions].join(", ")}</p>
                    <p id="mediumLarge-font">E-value(s): {[props.geneInfo.pfam_evalues].join(", ")}</p>
                    </>}
                  </>
                <div className="isolateGenes-info">
                  <div className="isolateGeneCount" id="medium-font">
                    Gene was found in {resultsRendered.length} isolates
                  </div>
                  <div className="msa-button" id="mediumLarge-font">
                    <a href={"https://bacquerya.azurewebsites.net:443/alignement/" + props.geneInfo.consistentNames} rel="noreferrer">Click to download multiple sequence alignment</a>
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