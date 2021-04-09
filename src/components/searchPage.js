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

import "../CSS/searchPage.css"

function SearchPage() {

    const [formData, updateFormData] = useState(null);
    const [searched, setSearched] = useState(false)
    const [queryType, setQueryType] = useState(null);
    const [search, setSearch] = useState(false);
    const [queryResult, setQueryResult] = useState(null);

    const getTerm = (e) => {
        setSearch(false);
        updateFormData(e.target.value);
    };

    const getType = (e) => {
        setSearch(false);
        setQueryType(e.target.value);
    };

    const loadResult = () => {
        setSearch(true);
    };

    //call async function to search for papers
    if (search === true && queryType === "paper") {
        paperQuery(formData).then(result => {
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
        });
    };
    //call async function to search for isolates
    if (search === true && queryType === "isolate") {
        isolateQuery(formData).then(result => {
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
        });
    };
    //call async function to search for genes
    if (search === true && queryType === "sequence") {
        geneQuery(formData).then(result => {
            setSearch(false);
            setSearched(true);
            setQueryResult(result);
        });
    };
    //map array of search results to an intepretable output
    if (queryType === "paper" && queryResult) {
        var resultsRendered = queryResult.map(result => {
            if (result.encodedDOI !== undefined) {
                return (
                    <li>
                        <Link to={"/paper/" + result.encodedDOI}>{result.Title}</Link>
                    </li>
        )}});
    };
    if (queryType === "isolate" && queryResult) {
        var resultsRendered = queryResult.map(result => {
            if (result.BioSample !== undefined) {
                return (
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
        )}});
    };
        if (queryType === "sequence" && queryResult) {
            var resultsRendered = queryResult.map(result => {
                if (result.geneName !== undefined) {
                    return (
                        <p key={result.geneName}>
                            Gene: <Link to={"/gene/" + result.geneName}>{result.geneName}</Link>, Match proportion: {result.numberMatching}%
                        </p>
            )}});
    };

    //conditional CSS
    const searchBar_class = searched ? "mb-3-used" : "mb-3";
    const spinner_class = searched ? "search-spinner-used" : "search-spinner";

    return(
        <div className="search-container">
            <>
            <Form inline className={searchBar_class}>
                <FormControl
                    name="searchTerm"
                    placeholder="Search term"
                    aria-label="Search term"
                    aria-describedby="basic-addon2"
                    onChange={getTerm} />
                <FormControl
                    as="select"
                    className="my-1 mr-sm-2"
                    id="type"
                    custom
                    onChange={getType}>
                    <option value='0'>choose...</option>
                    <option value="isolate">isolate</option>
                    <option value="paper">paper</option>
                    <option value="sequence">sequence</option>
                </FormControl>
                <Button onClick={loadResult} variant="outline-primary">Search</Button>
            </Form>
            { (search===true && queryType !== "0") && <Spinner className={spinner_class} animation="border" variant="primary" /> }
            { (search===false && searched == true && resultsRendered) && <Paginate resultsRendered={resultsRendered} />}
            { (search===false && searched == true && queryResult && queryResult.length === 0) && <div>No result...</div> }
            </>
        </div>
    );
};

export default SearchPage;