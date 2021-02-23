function IsolateDisplay(props) {

    return(
        <div>
            <h3>Isolate: {props.isolateInfo.isolateName}</h3>
            <p>Organism: {props.isolateInfo.Organism_name}</p>
            <p>Strain: {props.isolateInfo.Infraspecific_name}</p>
            <p>Assembly name: {props.isolateInfo.Assembly_name}</p>
            <p>Assembly level: {props.isolateInfo.isolateName}</p>
            <p>Genome representation: {props.isolateInfo.Genome_representation}</p>
            <p>Submitter: {props.isolateInfo.Submitter}</p>
            <p>Date submitted: {props.isolateInfo.Date}</p>
            <p>Taxid: {props.isolateInfo.Taxid}</p>
            <p>GenBank assembly accession: {props.isolateInfo.GenBank_assembly_accession}</p>
            <p>RefSeq assembly accession: {props.isolateInfo.RefSeq_assembly_accession}</p>
            <p>BioProject link: {props.isolateInfo.BioProject}</p>
            <p>BioProject sample: {props.isolateInfo.BioSample}</p>
        </div>
    )
};

export default IsolateDisplay;