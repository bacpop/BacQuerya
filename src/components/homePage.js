import {useState, useEffect} from "react"
import { Link } from "react-router-dom";

import "../CSS/homePage.css"

const HomePage = () => {

    return(
        <div className="homepage-container">
            <h1>Welcome to BacQuerya, a new search tool for prokaryotic genomic information.</h1>
            <li>
                <Link to="/search">Search for information</Link>
            </li>
        </div>
    );
};

export default HomePage;