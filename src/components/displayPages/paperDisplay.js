
function PaperPage(props) {
    console.log(props.paperInfo)
    return(
        <div>
            <>
            <h3>Title: {props.paperInfo.Title}</h3>
            <p>Authors: {props.paperInfo.AuthorList.join(", ")}</p>
            <p>Journal name: {props.paperInfo.FullJournalName}</p>
            <p>Volume: {props.paperInfo.Volume}</p>
            <p>Issue: {props.paperInfo.Issue}</p>
            <p>Page(s): {props.paperInfo.Pages}</p>
            <p>Received: {props.paperInfo.History.received}</p>
            <p>Accepted: {props.paperInfo.History.accepted}</p>
            <p>DOI: {props.paperInfo.DOI}</p>
            <p>PMC ID: {props.paperInfo.ArticleIds.pmc}</p>
            <p>PubMed ID: {props.paperInfo.ArticleIds.pubmed[0]}</p>
            <p>RID: {props.paperInfo.ArticleIds.rid}</p>
            </>
        </div>
    );
};

export default PaperPage;