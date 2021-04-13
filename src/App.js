import {useState, useEffect} from "react"
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HomePage from './components/homePage'
import SearchPage from './components/searchPage'
import PaperPage from './components/loadURLs/paperPage'
import GenePage from './components/loadURLs/genePage'
import SpeciesPage from './components/loadURLs/speciesPage'
import GenusPage from './components/loadURLs/genusPage'
import IsolatePage from './components/loadURLs/isolatePage'

function App() {

  //resize component on window resize
  const [windowWidth, setWidth] = useState(window.innerWidth)
  const [windowHeight, setHeight] = useState(window.innerHeight)
  const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
  };
  useEffect(() => {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <main className="App" style={{height: windowHeight + "px", width: windowWidth + " px"}}>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/paper/:encodedDOI" component={PaperPage} />
        <Route exact path="/gene/:geneName" component={GenePage} />
        <Route exact path="/:Genus/:Species/:BioSample" component={IsolatePage} />
        <Route exact path="/:Genus/:Species" component={SpeciesPage} />
        <Route exact path="/:Genus" component={GenusPage} />
      </Router>
    </main>
  );
};

export default App;
