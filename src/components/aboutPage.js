import '../App.css';
import "../CSS/aboutPage.css"

const AboutPage = () => {

    console.log(window.innerWidth)
    return(
        <div className="homepage-container">
            <h1 id="homepage-text">Welcome to BacQuerya, a new search tool for prokaryotic genomic information.</h1>
            <p id="mediumLarge-font">
                BacQuerya has been designed to streamline information sharing and reuse in Pathogen informatics by retrieving and linking genomic metadata from a range of information sources.
            </p>
            <p id="mediumLarge-font">
                Isolate-, gene- and study-specific overviews of metadata allow easy filtering and navigation of available genomic information.
            </p>
            <p id="mediumLarge-font">
                Users specify a query type (gene, isolate, sequence or study) and the appropriate index is searched for the query term.
            </p>
            <p id="mediumLarge-font">
                Users may also download up to 100 genomic sequences by filtering through isolate search results and clicking "Download all genomic sequences". Above 100 sequences, a .txt file listing the sequence URLs for the resquested isolates is downloaded.
            </p>
        </div>
    );
};

export default AboutPage;