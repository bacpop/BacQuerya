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
            <h3>Isolate: {props.isolateInfo.isolateName}</h3>
            <div className="isolate-grid">
                <div className="assembly-stats">
                    <h5>Isolate overview</h5>
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
                    <p>BioProject sample: <a href={"https://www.ncbi.nlm.nih.gov/biosample/"+props.isolateInfo.BioSample}>{props.isolateInfo.BioSample}</a></p>
                    { (typeof props.isolateInfo.sequenceURL === 'string') && <p>Click to download assembly file: <a href={props.isolateInfo.sequenceURL} rel="noreferrer"> {props.isolateInfo.sequenceURL.split("/")[props.isolateInfo.sequenceURL.split("/").length - 1]} </a></p>}
                    { (Array.isArray(props.isolateInfo.sequenceURL) === true) && <div>Click to download read files: {sequenceLinks(props.isolateInfo.sequenceURL)}</div>}
                </div>
                    { (props.isolateInfo.scaffold_stats !== undefined) &&
                        <div className="sequence-stats">
                            <h5>Scaffold stats</h5>
                                <p>Total sequence length: {props.isolateInfo.scaffold_stats.total_bps}</p>
                                <p>L50: {props.isolateInfo.scaffold_stats.L50}</p>
                                <p>N50: {props.isolateInfo.scaffold_stats.N50}</p>
                                <p>G/C content (%): {props.isolateInfo.scaffold_stats.gc_content}</p>
                                <p>Number of scaffolds: {props.isolateInfo.scaffold_stats.sequence_count}</p>
                                <p>Longest scaffold length: {props.isolateInfo.scaffold_stats.longest}</p>
                                <p>Shortest scaffold length: {props.isolateInfo.scaffold_stats.shortest}</p>
                                <p>Mean scaffold length: {props.isolateInfo.scaffold_stats.mean}</p>
                            <h5>Contig stats</h5>
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