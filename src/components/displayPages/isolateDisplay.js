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
    if (props.isolateInfo.panarooNames) {
        var resultsRendered = props.isolateInfo.panarooNames.map((result, index)=> {
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
            <div className="geneDisplay-endpoint">
                <p style={{display: "inline-block"}}> > </p>
                <Link style={{display: "inline-block"}} to={"/isolate/streptococcus"} target="_blank">streptococcus</Link>
                <p style={{display: "inline-block"}}> > </p>
                <Link style={{display: "inline-block"}} to={"/isolate/streptococcus/" + "pneumoniae"} target="_blank">pneumoniae</Link>
                <p style={{display: "inline-block"}}> > </p>
                <Link style={{display: "inline-block"}} to={"/isolate/streptococcus/pneumoniae/" + props.isolateInfo.BioSample} target="_blank"> {props.isolateInfo.BioSample} </Link>
            </div>
            <h3>Isolate: {props.isolateInfo.isolateName}</h3>
            <div className="isolate-grid">
                <div className="assembly-stats">
                    <h5 style={{marginLeft:"15%"}}>Isolate overview</h5>
                    <p>Organism: {props.isolateInfo.Organism_name}</p>
                    { (props.isolateInfo.Infraspecific_name !== undefined) && <p>Strain: {props.isolateInfo.Infraspecific_name}</p> }
                    { (props.isolateInfo.Assembly_name !== undefined) &&<p>Assembly name: {props.isolateInfo.Assembly_name}</p> }
                    { (props.isolateInfo.Assembly_level !== undefined) && <p>Assembly level: {props.isolateInfo.Assembly_level}</p> }
                    <p>Genome representation: {props.isolateInfo.Genome_representation}</p>
                    <p>Submitter: {props.isolateInfo.Submitter}</p>
                    <p>Date submitted: {props.isolateInfo.Date}</p>
                    <p>Taxid: {props.isolateInfo.Taxid}</p>
                    { (props.isolateInfo.GenBank_assembly_accession !== undefined) && <p>GenBank assembly accession: {props.isolateInfo.GenBank_assembly_accession}</p> }
                    { (props.isolateInfo.RefSeq_assembly_accession !== undefined) && <p>RefSeq assembly accession: {props.isolateInfo.RefSeq_assembly_accession}</p> }
                    { (props.isolateInfo.BioProject !== undefined) && <p>BioProject link: {props.isolateInfo.BioProject}</p> }
                    <p>BioProject sample: <a href={"https://www.ncbi.nlm.nih.gov/biosample/"+props.isolateInfo.BioSample} target="_blank">{props.isolateInfo.BioSample}</a></p>
                    { (typeof props.isolateInfo.sequenceURL === 'string') && <p>Click to download assembly file: <a href={props.isolateInfo.sequenceURL} rel="noreferrer"> {props.isolateInfo.sequenceURL.split("/")[props.isolateInfo.sequenceURL.split("/").length - 1]} </a></p>}
                    { (Array.isArray(props.isolateInfo.sequenceURL) === true) && <div>Click to download read files: {sequenceLinks(props.isolateInfo.sequenceURL)}</div>}
                </div>
                <div className="biosample-stats">
                    <h5 style={{marginLeft:"15%"}}>BioSample stats</h5>
                        { (props.isolateInfo.BioSample_SubmissionDate !== undefined) && <p>Submission date: {props.isolateInfo.BioSample_SubmissionDate}</p>}
                        { (props.isolateInfo.BioSample_LastUpdate !== undefined) && <p>Last updated: {props.isolateInfo.BioSample_LastUpdate}</p>}
                        { (props.isolateInfo.BioSample_SpecificHost !== undefined) && <p>Specific host: {props.isolateInfo.BioSample_SpecificHost}</p>}
                        { (props.isolateInfo.BioSample_IsolationSource !== undefined) && <p>Isolation source: {props.isolateInfo.BioSample_IsolationSource}</p>}
                        { (props.isolateInfo.BioSample_HostHealthState !== undefined) && <p>Host health status: {props.isolateInfo.BioSample_HostHealthState}</p>}
                        { (props.isolateInfo.BioSample_SeroVar !== undefined) && <p>Serotype: {props.isolateInfo.BioSample_SeroVar}</p>}
                        { (props.isolateInfo.BioSample_CollectionLocation !== undefined) && <p>Collection location: {props.isolateInfo.BioSample_CollectionLocation}</p>}
                        { (props.isolateInfo.BioSample_Owner !== undefined) && <p>Owner: {props.isolateInfo.BioSample_Owner}</p>}
                        { (props.isolateInfo.BioSample_INSDCCenterName !== undefined) && <p>INSDC center name: {props.isolateInfo.BioSample_INSDCCenterName}</p>}
                        { (props.isolateInfo.BioSample_Status !== undefined) && <p>Status: {props.isolateInfo.BioSample_Status}</p>}
                </div>
                { (props.isolateInfo.contig_stats !== undefined) &&
                    <div className="contig-stats">
                        <h5 style={{marginLeft:"15%"}}>Contig stats</h5>
                            <p>Total sequence length: {props.isolateInfo.contig_stats.total_bps}</p>
                            <p>L50: {props.isolateInfo.contig_stats.L50}</p>
                            <p>N50: {props.isolateInfo.contig_stats.N50}</p>
                            <p>G/C content (%): {props.isolateInfo.contig_stats.gc_content}</p>
                            <p>Number of contigs: {props.isolateInfo.contig_stats.sequence_count}</p>
                            <p>Longest contig length: {props.isolateInfo.contig_stats.longest}</p>
                            <p>Shortest contig length: {props.isolateInfo.contig_stats.shortest}</p>
                            <p>Mean contig length: {props.isolateInfo.contig_stats.mean}</p>
                    </div>
                }
            </div>
            {(props.isolateInfo.panarooNames) && <div>
                <Paginate resultNumber={80} resultsRendered={resultsRendered} queryType="genesContained"/>
            </div>}
            </>
        </div>
    )
};

export default IsolateDisplay;