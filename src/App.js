import {useState, useEffect} from "react"
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AboutPage from './components/aboutPage'
import SearchPage from './components/searchPage'
import StudyPage from './components/loadURLs/studyPage'
import GenePage from './components/loadURLs/genePage'
import SpeciesPage from './components/loadURLs/speciesPage'
import GenusPage from './components/loadURLs/genusPage'
import IsolatePage from './components/loadURLs/isolatePage'
import submissionPage from './components/displayPages/submissionDisplay'

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
        <Route exact path="/" component={SearchPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/study/:encodedDOI" component={StudyPage} />
        <Route exact path="/gene/:geneName" component={GenePage} />
        <Route exact path="/isolate/:Genus/:Species/:BioSample" component={IsolatePage} />
        <Route exact path="/isolate/:Genus/:Species" component={SpeciesPage} />
        <Route exact path="/isolate/:Genus/" component={GenusPage} />
        <Route exact path="/submit/:encodedDOI/" component={submissionPage} />
      </Router>
    </main>
  );
};

export default App;
