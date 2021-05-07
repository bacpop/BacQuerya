import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from "react-router-dom";

import isolateQuery from './indexQuerying/isolateQuery'
import paperQuery from './indexQuerying/paperQuery'
import geneQuery from './indexQuerying/geneQuery'
import sequenceQuery from './indexQuerying/sequenceQuery'
import Paginate from './paginateResults'
import { FilterComponent, filterResults } from './searchFilters'
import { SequenceDownload } from './sequenceDownload'
import "../CSS/searchPage.css"

function SearchPage() {

    const [formData, updateFormData] = useState(null);
    const [searched, setSearched] = useState(false)
    const [queryType, setQueryType] = useState(null);
    const [queryNumber, setQueryNumber] = useState(null);
    const [search, setSearch] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const [openFilters, setOpenFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({assemblies: true, reads: true, minN50: 0, noContigs: "All"});
    const [showDownloadOptions, setOpenDownloads] = useState(false);
    const [emailValue, setEmailValue] = useState("Enter email");

    function handleSubmit(e) {
        e.preventDefault()
        setSearch(true);
        setSearched(false);
        setQueryResult(null)
        setSelectedFilters({assemblies: true, reads: true, minN50: 0, noContigs: "All"})
        setOpenDownloads(false)
        setEmailValue("Enter email")
        updateFormData(e.target.searchTerm.value)
        setQueryType(e.target.searchType.value)
    };

    //call async function to search for papers
    if (search === true && queryType === "paper") {
        paperQuery(formData).then(result => {
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
            setQueryNumber(31)
        });
    };
    //call async function to search for isolates
    if (search === true && queryType === "isolate") {
        isolateQuery(formData).then(result => {
            setSelectedFilters({assemblies: true, reads: true, minN50: 0, noContigs: "All"});
            setOpenDownloads(false)
            setEmailValue("Enter email")
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
            setQueryNumber(31)
        });
    };
    //call async function to search for genes
    if (search === true && queryType === "gene") {
        geneQuery(formData).then(result => {
            setQueryNumber(30)
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
        });
    };
    //call async function to search for sequences
    if (search === true && queryType === "sequence") {
        sequenceQuery(formData).then(result => {
            setQueryNumber(28)
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
        });
    };
    //map array of search results to an intepretable output
    if (queryType === "paper" && queryResult && queryResult.length !== 0) {
        var resultsRendered = queryResult.map((result, index) => {
            if (result.encodedDOI !== undefined) {
                return (
                    <li key={index} className="paper-returned" id="mediumLarge-font">
                        <Link to={"/paper/" + result.encodedDOI} target="_blank">{result.Title}</Link>
                    </li>
        )}});
    };

    const fastSequenceLinks = links =>
        links.map((link, index) => {
            return (
                <div className="readResult-fastlinks">
                    {(links.length === 2 && index === 0) && <a href={link} rel="noreferrer">forward</a>}
                    {(links.length === 2 && index === 1) && <a href={link} rel="noreferrer">reverse</a>}
                    {(links.length === 3 && index === 0) && <a href={link} rel="noreferrer">full</a>}
                    {(links.length === 3 && index === 1) && <a href={link} rel="noreferrer">forward</a>}
                    {(links.length === 3 && index === 2) && <a href={link} rel="noreferrer">reverse</a>}
                </div>
        )});

    const splitGeneNames = (geneName, consistentName) =>
        geneName.map(name => {
            if (name.indexOf("UNNAMED_") === -1 && name.indexOf("PRED_") === -1) {
                return(<Link className="gene-returned-aliases-item" to={"/gene/" + consistentName} target="_blank">{name}</Link>);
        }});

    if (queryType === "isolate" && queryResult && queryResult.length !== 0 && searched === true && search === false) {
        console.log(queryResult)
        const filtersApplied = filterResults(queryResult, queryType, selectedFilters)
        const filteredResults = filtersApplied[0]
        var sequenceURLs = filtersApplied[1]
        if (filteredResults && filteredResults.length !== 0) {
            var resultsRendered = filteredResults.map((result, index) => {
                if (result._source !== undefined) {
                    return (
                        <div key={index} className="isolate-returned" id="mediumLarge-font">
                            <>
                            <div className="isolate-link">
                                <div className="isolate-summary">
                                    <p>Organism: {result._source.Organism_name}</p>
                                    <p>Genome representation: {result._source.Genome_representation}</p>
                                    {(result.source !== undefined) && <p>Source: {result._source.source}</p>}
                                    <p>BioProject sample: {result._source.BioSample}</p>
                                    {(result._source.scaffold_stats !== undefined) && <p>Total sequence length: {result._source.contig_stats.total_bps}</p>}
                                    {(result._source.scaffold_stats !== undefined) && <p>N50: {result._source.contig_stats.N50}</p>}
                                    {(result._source.scaffold_stats !== undefined) && <p>G/C content (%): {result._source.contig_stats.gc_content}</p>}
                                </div>
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
        )}})};
    };
        if (queryType === "sequence" && queryResult && queryResult.length !== 0) {
            var resultsRendered = queryResult.map((result, index)=> {
                if (result.geneName !== undefined) {
                    return (
                        <p key={index} className="sequence-returned" id="mediumLarge-font">
                            <Link className="geneResult-align" to={"/gene/" + result.geneName} target="_blank">
                                {result.geneName}
                            </Link>
                            <p className="matchProportion-align">
                                {result.numberMatching}%
                            </p>
                        </p>
            )}});
    };

    if (queryType === "gene" && queryResult && queryResult.length !== 0) {
        var resultsRendered = queryResult.map((result, index)=> {
            console.log(result)
            if (result._source.consistentNames !== undefined) {
                if (result._source.pfam_names) {
                    var geneNames = splitGeneNames(result._source.panarooNames.split("~~~").concat([result._source.pfam_names]), result._source.consistentNames)
                };
                if (result._source.pfam_names === undefined) {
                    var geneNames = splitGeneNames(result._source.panarooNames.split("~~~"), result._source.consistentNames)
                };
                return (
                    <div key={index} className="gene-returned" id="mediumLarge-font">
                        <Link className="gene-returned-name" to={"/gene/" + result._source.consistentNames} target="_blank">
                            {result._source.consistentNames}
                        </Link>
                        <div className="gene-returned-aliases">
                            {(geneNames.length !== 1) && geneNames}
                            {(geneNames.length === 1) && geneNames.slice(1)}
                        </div>
                        <div className="gene-returned-description">
                            {(result._source.pfam_descriptions) && ([result._source.panarooDescriptions[0]].concat(result._source.pfam_descriptions)).join("; ")}
                            {(result._source. pfam_descriptions === undefined) && result._source.panarooDescriptions[0]}
                        </div>
                    </div>
        )}});
    };

    //conditional CSS
    const searchBar_class = searched ? "mb-3-used" : "mb-3";
    const spinner_class = searched ? "search-spinner-used" : "search-spinner";
    const downloadOptions_container = showDownloadOptions ? "downloadOptions-options-container" : "downloadOptions-options-container-hidden";

    return(
        <div className="search-container">
            <>
            <Form inline className={searchBar_class} onSubmit={handleSubmit}>
                <FormControl
                    name="searchTerm"
                    placeholder="Search term"
                    aria-label="Search term"
                    aria-describedby="basic-addon2"/>
                <FormControl
                    as="select"
                    name="searchType"
                    className="my-1 mr-sm-2"
                    id="type"
                    custom>
                    <option value="isolate">isolate</option>
                    <option value="paper">paper</option>
                    <option value="gene">gene</option>
                    <option value="sequence">sequence</option>
                </FormControl>
                <Button type="submit" variant="outline-primary">Search</Button>
            </Form>
            { (search===true) && <Spinner className={spinner_class} animation="border" variant="primary" /> }
            { (search===false && searched == true && resultsRendered && queryNumber) &&
                <div className="searchResults-brief" id="sequenceResult-brief-font">
                    {resultsRendered.length} results
                </div>}
            { (queryType === "isolate" && search===false && searched == true) &&
                <>
                    <div className="filterOptions-container" id="mediumLarge-font">
                        <div className="filterOptions-text" onClick={() => setOpenFilters(true)}>
                            Click to filter results
                        </div>
                    </div>
                    <div>
                    { (openFilters) &&
                        <div className="filterOptions-options-container" id="mediumLarge-font">
                            <FilterComponent setOpenFilters={setOpenFilters} setSelectedFilters={setSelectedFilters} selectedFilters={selectedFilters}/>
                        </div>}
                    </div>
                    <div className="downloadOptions-container" id="mediumLarge-font">
                        <div className="downloadOptions-text" onClick={() => setOpenDownloads(true)}>
                            Click to download all sequences
                        </div>
                    </div>
                    <div>
                    { (showDownloadOptions) &&
                        <div className={downloadOptions_container}>
                            <SequenceDownload setOpenDownloads={setOpenDownloads} sequenceURLs={sequenceURLs} emailValue={emailValue} setEmailValue={setEmailValue}/>
                        </div>}
                    </div>
                </>}
            { (search===false && searched == true && resultsRendered && queryNumber) &&
                <Paginate resultNumber={queryNumber} resultsRendered={resultsRendered} queryType={queryType}/>}
            { (search===false && searched == true && resultsRendered == undefined) && <div className="noSearchResults">No result...</div> }
            </>
        </div>
    );
};

export default SearchPage;