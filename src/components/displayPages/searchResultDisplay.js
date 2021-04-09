import { Link } from "react-router-dom";

const renderSearchResult = (queryType, results) => {
    if (queryType === "paper") {
        return (
            results.map(result => {
                <li>
                    <Link to={"/paper/" + result.encodedDOI}>{result.Title}</Link>
                </li>
        }))};
    if (queryType === "isolate") {
        return (
            results.map(result => {
                <div className="isolate-returned">
                    <>
                    <div className="isolate-link">
                        <Link to={"/isolate/" + result.BioSample}>{result.BioSample}</Link>
                        <div className="isolate-summary">
                            <p>Organism: {result.Organism_name}</p>
                            <p>Genome representation: {result.Genome_representation}</p>
                            {(result.source !== undefined) && <p>Source: {result.source}</p>}
                            <p>BioProject sample: {result.BioSample}</p>
                            {(result.scaffold_stats !== undefined) && <p>Total sequence length: {result.scaffold_stats.total_bps}</p>}
                            {(result.scaffold_stats !== undefined) && <p>N50: {result.contig_stats.N50}</p>}
                            {(result.scaffold_stats !== undefined) && <p>G/C content (%): {result.contig_stats.gc_content}</p>}
                        </div>
                    </div>
                    </>
                </div>
        }))};
    if (queryType === "sequence") {
        return(
            results.map(result => {
                <p key={result.geneName}>
                    Gene: <Link to={"/gene/" + result.geneName}>{result.geneName}</Link>, Match proportion: {result.numberMatching}%
                </p>
        }))};
};

export default renderSearchResult;