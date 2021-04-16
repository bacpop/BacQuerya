import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from "react-router-dom";

import isolateQuery from './indexQuerying/isolateQuery'
import paperQuery from './indexQuerying/paperQuery'
import geneQuery from './indexQuerying/geneQuery'
import Paginate from './paginateResults'
import { FilterComponent } from './searchFilters'
import "../CSS/searchPage.css"

function SearchPage() {

    const [formData, updateFormData] = useState(null);
    const [searched, setSearched] = useState(false)
    const [queryType, setQueryType] = useState(null);
    const [queryNumber, setQueryNumber] = useState(null);
    const [search, setSearch] = useState(false);
    const [queryResult, setQueryResult] = useState(null);
    const [openFilters, setOpenFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({assemblies: true, reads: true});

    function handleSubmit(e) {
        e.preventDefault()
        setSearch(true);
        updateFormData(e.target.searchTerm.value)
        setQueryType(e.target.searchType.value)
    };
    console.log(selectedFilters)

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
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
            setQueryNumber(31)
        });
    };
    //call async function to search for genes
    if (search === true && queryType === "sequence") {
        geneQuery(formData).then(result => {
            setQueryNumber(28)
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
        });
    };
    //map array of search results to an intepretable output
    if (queryType === "paper" && queryResult) {
        var resultsRendered = queryResult.map((result, index) => {
            if (result.encodedDOI !== undefined) {
                return (
                    <li key={index}>
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

    if (queryType === "isolate" && queryResult) {
        var resultsRendered = queryResult.map((result, index) => {
            if (result._source !== undefined) {
                return (
                    <div className="isolate-returned">
                        <>
                        <div className="isolate-link">
                            <div className="isolate-summary">
                                <p>Organism: {result._source.Organism_name}</p>
                                <p>Genome representation: {result._source.Genome_representation}</p>
                                {(result.source !== undefined) && <p>Source: {result._source.source}</p>}
                                <p>BioProject sample: {result._source.BioSample}</p>
                                {(result._source.scaffold_stats !== undefined) && <p>Total sequence length: {result._source.scaffold_stats.total_bps}</p>}
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
        )}});
    };
        if (queryType === "sequence" && queryResult) {
            var resultsRendered = queryResult.map((result, index)=> {
                if (result.geneName !== undefined) {
                    return (
                        <p key={index}>
                            <Link className="geneResult-align" to={"/gene/" + result.geneName} target="_blank">
                                {result.geneName}
                            </Link>
                            <p className="matchProportion-align">
                                {result.numberMatching}%
                            </p>
                        </p>
            )}});
    };

    //conditional CSS
    const searchBar_class = searched ? "mb-3-used" : "mb-3";
    const spinner_class = searched ? "search-spinner-used" : "search-spinner";

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
                    <option value="sequence">sequence</option>
                </FormControl>
                <Button type="submit" variant="outline-primary">Search</Button>
            </Form>
            { (search===true) && <Spinner className={spinner_class} animation="border" variant="primary" /> }
            { (search===false && searched == true && resultsRendered && queryNumber) &&
                <>
                    <div className="searchResults-brief" id="sequenceResult-brief-font">
                        {resultsRendered.length} results
                    </div>
                    <div className="filterOptions-container">
                        <div className="filterOptions-text" onClick={() => setOpenFilters(true)}>
                            Click to filter results
                        </div>
                    </div>
                    { (openFilters) &&
                        <div className="filterOptions-options-container">
                            <FilterComponent setOpenFilters={setOpenFilters} setSelectedFilters={setSelectedFilters} selectedFilters={selectedFilters}/>
                        </div>}
                </>}
            { (search===false && searched == true && resultsRendered && queryNumber) && <Paginate resultNumber={queryNumber} resultsRendered={resultsRendered} queryType={queryType}/>}
            { (search===false && searched == true && queryResult && queryResult.length === 0) && <div>No result...</div> }
            </>
        </div>
    );
};

export default SearchPage;