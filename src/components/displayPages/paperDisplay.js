import {useState, useEffect} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from "react-router-dom";

import isolateQuery from '../indexQuerying/isolateQuery'
import Paginate from '../paginateResults'

function PaperPage(props) {

    const [openCitaitonsResult, setOpenCitations] = useState(undefined)
    const [searched, setSearched] = useState(false)
    const [queryResult, setQueryResult] = useState(null);

    useEffect(() => {
        fetch("https://api.crossref.org/works/" + props.paperInfo.DOI).then((response) => response.json()).then((responseJson) => {
            setOpenCitations(responseJson.message)
        });
        //call async function to search for isolates
        if (props.paperInfo.DOI === "10.1038/sdata.2015.58") {
            isolateQuery("GCF").then(result => {
                setSearched(true);
                setQueryResult(result);
            });
        };
    }, [setOpenCitations, setSearched, setQueryResult]);

    function cleanAbsract(string) {
        var recordArray = string.split((/[>,<]+/));
            for (var i = 0; i < recordArray.length; i++) {
                if (recordArray[i].indexOf('jats') > -1 || recordArray[i].indexOf('Abstract') > -1) {
                    recordArray[i] = "";
                }
            }
        return recordArray
    };

    const fastSequenceLinks = links =>
        links.map((link, index) => {
            return (
                <div className="readResult-fastlinks">
                    {(index === 0) && <a href={link} rel="noreferrer">full</a>}
                    {(index === 1) && <a href={link} rel="noreferrer">forward</a>}
                    {(index === 2) && <a href={link} rel="noreferrer">reverse</a>}
                </div>
        )});

    if (queryResult) {
        var resultsRendered = queryResult.map((result, index) => {
            if (result._source !== undefined) {
                return (
                    <div className="isolate-returned">
                        <>
                        <div className="isolate-link">
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
    console.log(props.paperInfo)
    return(
        <div>
            {(openCitaitonsResult === undefined && props.paperInfo.DOI !== "10.1038/sdata.2015.58") && <Spinner animation="border" variant="primary" />}
            {(searched == false && props.paperInfo.DOI === "10.1038/sdata.2015.58"| resultsRendered === undefined && props.paperInfo.DOI === "10.1038/sdata.2015.58") && <Spinner animation="border" variant="primary" />}
            {(openCitaitonsResult !== undefined && searched == true && props.paperInfo.DOI === "10.1038/sdata.2015.58") &&
                <>
                <h3>{props.paperInfo.Title}</h3>
                <p>Authors: {props.paperInfo.AuthorList.join(", ")}</p>
                <p>Journal name: {props.paperInfo.FullJournalName}</p>
                { (props.paperInfo.Volume !== "") && <p>Volume: {props.paperInfo.Volume}</p> }
                { (props.paperInfo.Issue !== "") && <p>Issue: {props.paperInfo.Issue}</p> }
                { (props.paperInfo.Pages !== "") && <p>Page(s): {props.paperInfo.Pages}</p> }
                { (props.paperInfo.History.received !== undefined) && <p>Received: {props.paperInfo.History.received}</p> }
                { (props.paperInfo.History.accepted !== undefined) && <p>Accepted: {props.paperInfo.History.accepted}</p> }
                { (props.paperInfo.EPubDate !== "") && <p>ePub Date: {props.paperInfo.EPubDate}</p> }
                <p>DOI: {props.paperInfo.DOI}</p>
                { (props.paperInfo.ArticleIds.pmc !== undefined) && <p>PMC ID: {props.paperInfo.ArticleIds.pmc}</p> }
                <p>PubMed ID: {props.paperInfo.ArticleIds.pubmed[0]}</p>
                <p>RID: {props.paperInfo.ArticleIds.rid}</p>
                { (openCitaitonsResult.URL !== undefined) && <p>View paper at source: <a href={openCitaitonsResult.URL}>{openCitaitonsResult.URL}</a></p> }
                { (openCitaitonsResult.link[0].URL !== undefined) && <p>Download paper: <a href={openCitaitonsResult.link[0].URL}>{openCitaitonsResult.link[0].URL}</a></p> }
                { (openCitaitonsResult.abstract !== undefined) && <p>{cleanAbsract(openCitaitonsResult.abstract)}</p> }
                { (props.paperInfo.DOI === "10.1038/sdata.2015.58" && resultsRendered) && <Paginate resultNumber={20} resultsRendered={resultsRendered} queryType="isolatesContained"/>}
                </> }
            {(openCitaitonsResult !== undefined && props.paperInfo.DOI !== "10.1038/sdata.2015.58") &&
                <>
                <h3>{props.paperInfo.Title}</h3>
                <p>Authors: {props.paperInfo.AuthorList.join(", ")}</p>
                <p>Journal name: {props.paperInfo.FullJournalName}</p>
                { (props.paperInfo.Volume !== "") && <p>Volume: {props.paperInfo.Volume}</p> }
                { (props.paperInfo.Issue !== "") && <p>Issue: {props.paperInfo.Issue}</p> }
                { (props.paperInfo.Pages !== "") && <p>Page(s): {props.paperInfo.Pages}</p> }
                { (props.paperInfo.History.received !== undefined) && <p>Received: {props.paperInfo.History.received}</p> }
                { (props.paperInfo.History.accepted !== undefined) && <p>Accepted: {props.paperInfo.History.accepted}</p> }
                { (props.paperInfo.EPubDate !== "") && <p>ePub Date: {props.paperInfo.EPubDate}</p> }
                <p>DOI: {props.paperInfo.DOI}</p>
                { (props.paperInfo.ArticleIds.pmc !== undefined) && <p>PMC ID: {props.paperInfo.ArticleIds.pmc}</p> }
                <p>PubMed ID: {props.paperInfo.ArticleIds.pubmed[0]}</p>
                <p>RID: {props.paperInfo.ArticleIds.rid}</p>
                { (openCitaitonsResult.URL !== undefined) && <p>View paper at source: <a href={openCitaitonsResult.URL}>{openCitaitonsResult.URL}</a></p> }
                { (openCitaitonsResult.link !== undefined) && <p>Download paper: <a href={openCitaitonsResult.link[0].URL}>{openCitaitonsResult.link[0].URL}</a></p> }
                { (openCitaitonsResult.abstract !== undefined) && <p>{cleanAbsract(openCitaitonsResult.abstract)}</p> }
                </> }
        </div>
    );
};

export default PaperPage;