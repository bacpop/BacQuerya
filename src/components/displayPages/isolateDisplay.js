import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import Paginate from '../paginateResults';
import '../../CSS/isolateDisplay.css';

const sequenceLinks = links =>
    links.map(link => <p><a href={link} rel="noreferrer">{link.split("/")[link.split("/").length - 1]}</a></p>);

const penicillinSIR = abbreviation => {
    if (abbreviation == "S") {
        return "Susceptible"
    };
    if (abbreviation == "I") {
        return "Intermediate"
    };
    if (abbreviation == "R") {
        return "Resistant"
    };
};

// function to download isolate metadata as a JSON
function handleSaveToPC(jsonData) {
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = jsonData.BioSample + '.json';
    link.href = url;
    link.click();
};

function IsolateDisplay(props) {

    console.log(props.isolateInfo)

    //map array of search results to an intepretable output
    if (props.isolateInfo.consistentNames) {
        var resultsRendered = props.isolateInfo.consistentNames.map((result, index)=> {
            if (result !== undefined) {
                return (
                    <p key={index}>
                        <Link to={"/gene/" + result} target="_blank">
                            {result}
                        </Link>
                    </p>
        )}});
    };

    return(
        <div>
            <>
            <div className="geneDisplay-endpoint" id="large-font">
                <p style={{display: "inline-block"}}> > </p>
                <Link style={{display: "inline-block"}} to={"/isolate/streptococcus"} target="_blank">streptococcus</Link>
                <p style={{display: "inline-block"}}> > </p>
                <Link style={{display: "inline-block"}} to={"/isolate/streptococcus/" + "pneumoniae"} target="_blank">pneumoniae</Link>
                <p style={{display: "inline-block"}}> > </p>
                <Link style={{display: "inline-block"}} to={"/isolate/streptococcus/pneumoniae/" + props.isolateInfo.BioSample} target="_blank"> {props.isolateInfo.BioSample} </Link>
            </div>
            <h3 id="header-font">Isolate: {props.isolateInfo.isolateName}</h3>
            <div className="isolate-grid">
                <div className="assembly-stats">
                    <h5 style={{marginLeft:"15%"}} id="large-font">Overview</h5>
                    <p id="mediumLarge-font">Organism: {props.isolateInfo.Organism_name}</p>
                    { (props.isolateInfo.Infraspecific_name !== undefined) && <p id="mediumLarge-font">Strain: {props.isolateInfo.Infraspecific_name}</p> }
                    { (props.isolateInfo.Assembly_name !== undefined) &&<p id="mediumLarge-font">Assembly name: {props.isolateInfo.Assembly_name}</p> }
                    { (props.isolateInfo.Assembly_level !== undefined) && <p id="mediumLarge-font">Assembly level: {props.isolateInfo.Assembly_level}</p> }
                    <p id="mediumLarge-font">Genome representation: {props.isolateInfo.Genome_representation}</p>
                    <p id="mediumLarge-font">Submitter: {props.isolateInfo.Submitter}</p>
                    <p id="mediumLarge-font">Date submitted: {props.isolateInfo.Date}</p>
                    <p id="mediumLarge-font">Taxid: {props.isolateInfo.Taxid}</p>
                    { (props.isolateInfo.GenBank_assembly_accession !== undefined) && <p id="mediumLarge-font">GenBank assembly accession: <a href={"https://www.ncbi.nlm.nih.gov/assembly/" + props.isolateInfo.GenBank_assembly_accession.replace(" ", "_")} target="_blank">{props.isolateInfo.GenBank_assembly_accession}</a></p> }
                    { (props.isolateInfo.RefSeq_assembly_accession !== undefined) && <p id="mediumLarge-font">RefSeq assembly accession: <a href={"https://www.ncbi.nlm.nih.gov/assembly/" + props.isolateInfo.RefSeq_assembly_accession.replace(" ", "_")} target="_blank">{props.isolateInfo.RefSeq_assembly_accession}</a></p> }
                    { (props.isolateInfo.BioProject !== undefined) && <p id="mediumLarge-font">BioProject accession: <a href={"https://www.ncbi.nlm.nih.gov/bioproject/?term=" + props.isolateInfo.BioProject} target="_blank">{props.isolateInfo.BioProject}</a></p> }
                    <p id="mediumLarge-font">BioSample accession: <a href={"https://www.ncbi.nlm.nih.gov/biosample/" + props.isolateInfo.BioSample} target="_blank">{props.isolateInfo.BioSample}</a></p>
                    { (typeof props.isolateInfo.sequenceURL === 'string') && <p id="mediumLarge-font">Click to download assembly file: <a href={props.isolateInfo.sequenceURL} rel="noreferrer"> {props.isolateInfo.sequenceURL.split("/")[props.isolateInfo.sequenceURL.split("/").length - 1]} </a></p>}
                    { (Array.isArray(props.isolateInfo.sequenceURL) === true) && <div id="mediumLarge-font">Click to download read files: {sequenceLinks(props.isolateInfo.sequenceURL)}</div>}
                </div>
                <div className="biosample-stats">
                    <h5 style={{marginLeft:"15%"}} id="large-font">BioSample metadata</h5>
                        { (props.isolateInfo.BioSample_SubmissionDate !== undefined) && <p id="mediumLarge-font">Submission date: {props.isolateInfo.BioSample_SubmissionDate}</p>}
                        { (props.isolateInfo.BioSample_LastUpdate !== undefined) && <p id="mediumLarge-font">Last updated: {props.isolateInfo.BioSample_LastUpdate}</p>}
                        { (props.isolateInfo.BioSample_SpecificHost !== undefined) && <p id="mediumLarge-font">Specific host: {props.isolateInfo.BioSample_SpecificHost}</p>}
                        { (props.isolateInfo.BioSample_IsolationSource !== undefined) && <p id="mediumLarge-font">Isolation source: {props.isolateInfo.BioSample_IsolationSource}</p>}
                        { (props.isolateInfo.BioSample_HostHealthState !== undefined) && <p id="mediumLarge-font">Host health status: {props.isolateInfo.BioSample_HostHealthState}</p>}
                        { (props.isolateInfo.BioSample_SeroVar !== undefined) && <p id="mediumLarge-font">Serotype: {props.isolateInfo.BioSample_SeroVar}</p>}
                        { (props.isolateInfo.BioSample_CollectionLocation !== undefined) && <p id="mediumLarge-font">Collection location: {props.isolateInfo.BioSample_CollectionLocation}</p>}
                        { (props.isolateInfo.BioSample_Owner !== undefined) && <p id="mediumLarge-font">Owner: {props.isolateInfo.BioSample_Owner}</p>}
                        { (props.isolateInfo.BioSample_INSDCCenterName !== undefined) && <p id="mediumLarge-font">INSDC center name: {props.isolateInfo.BioSample_INSDCCenterName}</p>}
                        { (props.isolateInfo.BioSample_Status !== undefined) && <p id="mediumLarge-font">Status: {props.isolateInfo.BioSample_Status}</p>}
                </div>
                <div className="additional-stats">
                    <h5 style={{marginLeft:"15%"}} id="large-font">Additional metadata</h5>
                        { (props.isolateInfo.ERR !== undefined) && <p id="mediumLarge-font">ERR accession: <a href={"https://www.ebi.ac.uk/ena/browser/view/" + props.isolateInfo.ERR} target="_blank">{props.isolateInfo.ERR}</a></p>}
                        { (props.isolateInfo.ERS !== undefined) && <p id="mediumLarge-font">ERS accession: <a href={"https://www.ebi.ac.uk/ena/browser/view/" + props.isolateInfo.ERS} target="_blank">{props.isolateInfo.ERS}</a></p>}
                        { (props.isolateInfo.WGS_project !== undefined) && <p id="mediumLarge-font">WGS project: <a href={"https://www.ebi.ac.uk/ena/browser/view/" + props.isolateInfo.WGS_project}>{props.isolateInfo.WGS_project}</a></p>}
                        { (props.isolateInfo.Year !== undefined) && <p id="mediumLarge-font">Collection year: {props.isolateInfo.Year}</p>}
                        { (props.isolateInfo.Country !== undefined) && <p id="mediumLarge-font">Country: {props.isolateInfo.Country}</p>}
                        { (props.isolateInfo.GPSC !== undefined) && <p id="mediumLarge-font">GPSC: {props.isolateInfo.GPSC}</p>}
                        { (props.isolateInfo.In_Silico_Serotype !== undefined) && <p id="mediumLarge-font">In silico serotype: {props.isolateInfo.In_Silico_Serotype}</p>}
                        { (props.isolateInfo.In_Silico_St !== undefined) && <p id="mediumLarge-font">In silico sequence type: {props.isolateInfo.In_Silico_St}</p>}
                        { (props.isolateInfo.Disease !== undefined) && <p id="mediumLarge-font">Host disease state: {props.isolateInfo.Disease}</p>}
                        { (props.isolateInfo.Age_group !== undefined) && <p id="mediumLarge-font">Host age group: {props.isolateInfo.Age_group}</p>}
                        { (props.isolateInfo.Vaccine_Period !== undefined) && <p id="mediumLarge-font">Vaccine period: {props.isolateInfo.Vaccine_Period}</p>}
                        { (props.isolateInfo.Vaccine_Status !== undefined) && <p id="mediumLarge-font">Vaccine status: {props.isolateInfo.Vaccine_Status}</p>}
                        { (props.isolateInfo.WGS_PEN_SIR_Nonmeningitis !== undefined) && <p id="mediumLarge-font">Penicillin susceptibility: {penicillinSIR(props.isolateInfo.WGS_PEN_SIR_Nonmeningitis)}</p>}
                </div>
                { (props.isolateInfo.scaffold_stats !== undefined) &&
                    <div className="contig-stats">
                        <h5 style={{marginLeft:"15%"}} id="large-font">Assembly statistics</h5>
                            <p id="mediumLarge-font">Total sequence length: {props.isolateInfo.scaffold_stats.total_bps}</p>
                            <p id="mediumLarge-font">L50: {props.isolateInfo.scaffold_stats.L50}</p>
                            <p id="mediumLarge-font">N50: {props.isolateInfo.scaffold_stats.N50}</p>
                            <p id="mediumLarge-font">G/C content: {props.isolateInfo.scaffold_stats.gc_content.toFixed()}%</p>
                            <p id="mediumLarge-font">Number of contigs: {props.isolateInfo.contig_stats.sequence_count}</p>
                            <p id="mediumLarge-font">Longest contig length: {props.isolateInfo.contig_stats.longest}bp</p>
                            <p id="mediumLarge-font">Shortest contig length: {props.isolateInfo.contig_stats.shortest}bp</p>
                            <p id="mediumLarge-font">Mean contig length: {props.isolateInfo.contig_stats.mean.toFixed(1)}bp</p>
                    </div>
                }
            </div>
            <Button style={{marginLeft: "71%"}}id="mediumLarge-font" variant="outline-primary" onClick={ handleSaveToPC.bind(null, props.isolateInfo)}>
                Download metadata
            </Button>
            {(props.isolateInfo.consistentNames) && <div>
                <Paginate resultNumber={80} resultsRendered={resultsRendered} queryType="genesContained"/>
            </div>}
            </>
        </div>
    )
};

export default IsolateDisplay;