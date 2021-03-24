import {useState, useEffect} from 'react';
import Spinner from 'react-bootstrap/Spinner';

function PaperPage(props) {
    const [openCitaitonsResult, setOpenCitations] = useState(undefined)

    useEffect(() => {
          fetch("https://api.crossref.org/works/" + props.paperInfo.DOI).then((response) => response.json()).then((responseJson) => {
            setOpenCitations(responseJson.message)
          });
    }, [setOpenCitations]);

    function cleanAbsract(string) {
        var recordArray = string.split((/[>,<]+/));
            for (var i = 0; i < recordArray.length; i++) {
                if (recordArray[i].indexOf('jats') > -1 || recordArray[i].indexOf('Abstract') > -1) {
                    recordArray[i] = "";
                }
            }
        return recordArray
    };

    console.log(props.paperInfo)

    return(
        <div>
            {(openCitaitonsResult === undefined) && <Spinner animation="border" variant="primary" />}
            {(openCitaitonsResult !== undefined) &&
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
                </> }
        </div>
    );
};

export default PaperPage;