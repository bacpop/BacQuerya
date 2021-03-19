import { Link } from "react-router-dom";

const HomePage = () => {
    return(
        <div>
            <h1>Welcome to BacQuerya, a new search tool for prokaryotic genomic information.</h1>
            <li>
                <Link to="/search">Search for information</Link>
            </li>
        </div>
    );
};

export default HomePage;