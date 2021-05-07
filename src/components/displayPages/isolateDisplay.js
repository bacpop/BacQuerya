import { Link } from "react-router-dom";

import Paginate from '../paginateResults';
import '../../CSS/isolateDisplay.css';

function IsolateDisplay(props) {

    //Organism_name: NCBI Assemblies and ENA reads
    //Genome_representation: NCBI Assemblies and ENA reads
    //Submitter: NCBI Assemblies and ENA reads
    //Date: NCBI Assemblies and ENA reads
    //Taxid: NCBI Assemblies and ENA reads
    //Biosample: NCBI Assemblies and ENA reads
    console.log(props.isolateInfo)

    const sequenceLinks = links =>
        links.map(link => <p><a href={link} rel="noreferrer">{link.split("/")[link.split("/").length - 1]}</a></p>);

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
                    <h5 style={{marginLeft:"15%"}} id="large-font">Isolate overview</h5>
                    <p id="mediumLarge-font">Organism: {props.isolateInfo.Organism_name}</p>
                    { (props.isolateInfo.Infraspecific_name !== undefined) && <p id="mediumLarge-font">Strain: {props.isolateInfo.Infraspecific_name}</p> }
                    { (props.isolateInfo.Assembly_name !== undefined) &&<p id="mediumLarge-font">Assembly name: {props.isolateInfo.Assembly_name}</p> }
                    { (props.isolateInfo.Assembly_level !== undefined) && <p id="mediumLarge-font">Assembly level: {props.isolateInfo.Assembly_level}</p> }
                    <p id="mediumLarge-font">Genome representation: {props.isolateInfo.Genome_representation}</p>
                    <p id="mediumLarge-font">Submitter: {props.isolateInfo.Submitter}</p>
                    <p id="mediumLarge-font">Date submitted: {props.isolateInfo.Date}</p>
                    <p id="mediumLarge-font">Taxid: {props.isolateInfo.Taxid}</p>
                    { (props.isolateInfo.GenBank_assembly_accession !== undefined) && <p id="mediumLarge-font">GenBank assembly accession: {props.isolateInfo.GenBank_assembly_accession}</p> }
                    { (props.isolateInfo.RefSeq_assembly_accession !== undefined) && <p id="mediumLarge-font">RefSeq assembly accession: {props.isolateInfo.RefSeq_assembly_accession}</p> }
                    { (props.isolateInfo.BioProject !== undefined) && <p id="mediumLarge-font">BioProject link: {props.isolateInfo.BioProject}</p> }
                    <p id="mediumLarge-font">BioProject sample: <a href={"https://www.ncbi.nlm.nih.gov/biosample/"+props.isolateInfo.BioSample} target="_blank">{props.isolateInfo.BioSample}</a></p>
                    { (typeof props.isolateInfo.sequenceURL === 'string') && <p id="mediumLarge-font">Click to download assembly file: <a href={props.isolateInfo.sequenceURL} rel="noreferrer"> {props.isolateInfo.sequenceURL.split("/")[props.isolateInfo.sequenceURL.split("/").length - 1]} </a></p>}
                    { (Array.isArray(props.isolateInfo.sequenceURL) === true) && <div id="mediumLarge-font">Click to download read files: {sequenceLinks(props.isolateInfo.sequenceURL)}</div>}
                </div>
                <div className="biosample-stats">
                    <h5 style={{marginLeft:"15%"}} id="large-font">BioSample stats</h5>
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
                { (props.isolateInfo.contig_stats !== undefined) &&
                    <div className="contig-stats">
                        <h5 style={{marginLeft:"15%"}} id="large-font">Contig stats</h5>
                            <p id="mediumLarge-font">Total sequence length: {props.isolateInfo.contig_stats.total_bps}</p>
                            <p id="mediumLarge-font">L50: {props.isolateInfo.contig_stats.L50}</p>
                            <p id="mediumLarge-font">N50: {props.isolateInfo.contig_stats.N50}</p>
                            <p id="mediumLarge-font">G/C content (%): {props.isolateInfo.contig_stats.gc_content}</p>
                            <p id="mediumLarge-font">Number of contigs: {props.isolateInfo.contig_stats.sequence_count}</p>
                            <p id="mediumLarge-font">Longest contig length: {props.isolateInfo.contig_stats.longest}</p>
                            <p id="mediumLarge-font">Shortest contig length: {props.isolateInfo.contig_stats.shortest}</p>
                            <p id="mediumLarge-font">Mean contig length: {props.isolateInfo.contig_stats.mean}</p>
                    </div>
                }
            </div>
            {(props.isolateInfo.consistentNames) && <div>
                <Paginate resultNumber={80} resultsRendered={resultsRendered} queryType="genesContained"/>
            </div>}
            </>
        </div>
    )
};

export default IsolateDisplay;