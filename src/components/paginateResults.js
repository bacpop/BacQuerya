import { useState, useEffect } from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

function Paginate(props) {

    const [loadPageNumber, selectPageNumber] = useState(1);
    const [slicedResults, setSlicedResults] = useState(null);
    const [slicedResultIndices, setSlicedResultIndices] = useState(null);

    const clickedPage = (index) => {
        selectPageNumber(index);
    };

    useEffect(() => {
        var resultIndices = [];
        var paginatedResults = [];
        var i, j, temparray, chunk = 25;
        if (paginatedResults.length === 0) {
            for (i = 0, j = props.resultsRendered.length; i < j; i += chunk) {
                temparray = props.resultsRendered.slice(i, i + chunk);
                paginatedResults.push(temparray);
                resultIndices.push((i + chunk) / chunk);
            };
        };
        if (paginatedResults.length !== 0) {
            setSlicedResults(paginatedResults)
            setSlicedResultIndices(resultIndices)
        };
    }, [setSlicedResults, setSlicedResultIndices]);

    var renderedButtons = null
    if (slicedResultIndices) {
        renderedButtons = slicedResultIndices.map((result, index) => {
            return (
                <Nav.Link onClick={() => { clickedPage(index) }}>{index + 1}</Nav.Link>
            )});
        };
    return (
        <div className="searchResult-container">
            <>
            <div className="searchResult-box">
                { (slicedResults) && slicedResults[loadPageNumber] }
            </div>
            <Navbar className="custom-navbar">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        {(renderedButtons) && renderedButtons}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            </>
        </div>
    );
};

export default Paginate;