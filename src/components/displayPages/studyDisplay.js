import {useState, useEffect} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from "react-router-dom";

import { queryStudyIsolates } from '../indexQuerying/studyQuery'
import { specificIsolateQuery } from '../indexQuerying/isolateQuery'
import Paginate from '../paginateResults'
import '../../CSS/studyDisplay.css'

function StudyDisplay(props) {

    const [openCitaitonsResult, setOpenCitations] = useState(undefined)
    const [searched, setSearched] = useState(false)
    const [queryResult, setQueryResult] = useState(null);

    useEffect(() => {
        fetch("https://api.crossref.org/works/" + props.studyInfo.DOI).then((response) => response.json()).then((responseJson) => {
            setOpenCitations(responseJson.message)
        });
        //call async function to search for isolates
        queryStudyIsolates(props.studyInfo.DOI).then(result => {
            setSearched(true);
            if (result[0] !== undefined) {
                const values = Object.values(result[0]._source).filter(function( obj ) {
                    if (obj === props.studyInfo.DOI) {
                        return false;
                    };
                    return true;
                });
                specificIsolateQuery(values).then(information => {
                    setQueryResult(information);
                    console.log(information)
                });
            };
        });
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
    console.log(props.studyInfo)
    return(
        <div>
            {(openCitaitonsResult === undefined) && <Spinner animation="border" variant="primary" />}
            {(openCitaitonsResult !== undefined) &&
                <>
                <div className="studyInfo-container">
                    <h3 id="header-font">{props.studyInfo.Title}</h3>
                    <p id="mediumLarge-font">Authors: {props.studyInfo.AuthorList.join(", ")}</p>
                    <p id="mediumLarge-font">Journal name: {props.studyInfo.FullJournalName}</p>
                    { (props.studyInfo.Volume !== "") && <p id="mediumLarge-font">Volume: {props.studyInfo.Volume}</p> }
                    { (props.studyInfo.Issue !== "") && <p id="mediumLarge-font">Issue: {props.studyInfo.Issue}</p> }
                    { (props.studyInfo.Pages !== "") && <p id="mediumLarge-font">Page(s): {props.studyInfo.Pages}</p> }
                    { (props.studyInfo.History.received !== undefined) && <p id="mediumLarge-font">Received: {props.studyInfo.History.received}</p> }
                    { (props.studyInfo.History.accepted !== undefined) && <p id="mediumLarge-font">Accepted: {props.studyInfo.History.accepted}</p> }
                    { (props.studyInfo.EPubDate !== "") && <p id="mediumLarge-font">ePub Date: {props.studyInfo.EPubDate}</p> }
                    <p id="mediumLarge-font">DOI: {props.studyInfo.DOI}</p>
                    { (props.studyInfo.ArticleIds.pmc !== undefined) && <p id="mediumLarge-font">PMC ID: {props.studyInfo.ArticleIds.pmc}</p> }
                    <p id="mediumLarge-font">PubMed ID: {props.studyInfo.ArticleIds.pubmed[0]}</p>
                    <p id="mediumLarge-font">RID: {props.studyInfo.ArticleIds.rid}</p>
                    { (openCitaitonsResult.URL !== undefined) && <p id="mediumLarge-font">View study at source: <a href={openCitaitonsResult.URL} target="_blank">{openCitaitonsResult.URL}</a></p> }
                    { (openCitaitonsResult.link !== undefined) && <p id="mediumLarge-font">Download study: <a href={openCitaitonsResult.link[0].URL} target="_blank">{openCitaitonsResult.link[0].URL}</a></p> }
                    { (openCitaitonsResult.abstract !== undefined) && <p className="abstract-container" id="mediumLarge-font">{cleanAbsract(openCitaitonsResult.abstract)}</p> }
                    { (resultsRendered) && <Paginate resultNumber={20} resultsRendered={resultsRendered} queryType="isolatesContained"/>}
                </div>
                <div className="supplementary-container">
                    <div className="supplementary-button" id="mediumLarge-font">
                        <Link to={"/submit/" + props.studyInfo.encodedDOI} target="_blank">
                            Click to submit the accession IDs of isolates used in this study
                        </Link>
                    </div>
                </div>
                </> }
        </div>
    );
};

export default StudyDisplay;