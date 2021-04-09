import {useState, useEffect} from "react"
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HomePage from './components/homePage'
import SearchPage from './components/searchPage'
import IsolatePage from './components/loadURLs/isolatePage'
import PaperPage from './components/loadURLs/paperPage'
import GenePage from './components/loadURLs/genePage'


function App() {

  //resize component on window resize
  const [windowWidth, setWidth] = useState(window.outerWidth)
  const [windowHeight, setHeight] = useState(window.outerHeight)
  const updateDimensions = () => {
      setWidth(window.outerWidth);
      setHeight(window.outerHeight);
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
        <Route path="/isolate/:BioSample" component={IsolatePage} />
        <Route path="/paper/:encodedDOI" component={PaperPage} />
        <Route path="/gene/:geneName" component={GenePage} />
      </Router>
    </main>
  );
};

export default App;
