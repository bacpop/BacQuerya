import '../CSS/isolateDisplay.css';

function IsolateDisplay(props) {
    //Organism_name: NCBI Assemblies and ENA reads
    //Genome_representation: NCBI Assemblies and ENA reads
    //Submitter: NCBI Assemblies and ENA reads
    //Date: NCBI Assemblies and ENA reads
    //Taxid: NCBI Assemblies and ENA reads
    //Biosample: NCBI Assemblies and ENA reads
    return(
        <div>
            <>
            <h3>Isolate: {props.isolateInfo.isolateName}</h3>
            <div className="isolate-grid">
                <div className="assembly-stats">
                    <h5>Isolate overview</h5>
                    <p>Organism: {props.isolateInfo.Organism_name}</p>
                    <p>Strain: {props.isolateInfo.Infraspecific_name}</p>
                    <p>Assembly name: {props.isolateInfo.Assembly_name}</p>
                    <p>Assembly level: {props.isolateInfo.Assembly_level}</p>
                    <p>Genome representation: {props.isolateInfo.Genome_representation}</p>
                    <p>Submitter: {props.isolateInfo.Submitter}</p>
                    <p>Date submitted: {props.isolateInfo.Date}</p>
                    <p>Taxid: {props.isolateInfo.Taxid}</p>
                    <p>GenBank assembly accession: {props.isolateInfo.GenBank_assembly_accession}</p>
                    <p>RefSeq assembly accession: {props.isolateInfo.RefSeq_assembly_accession}</p>
                    <p>BioProject link: {props.isolateInfo.BioProject}</p>
                    <p>BioProject sample: {props.isolateInfo.BioSample}</p>
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
            </>
        </div>
    )
};

export default IsolateDisplay;