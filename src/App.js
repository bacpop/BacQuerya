import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import HomePage from './components/homePage'
import SearchPage from './components/searchPage'
import IsolatePage from './components/loadURLs/isolatePage'
import PaperPage from './components/loadURLs/paperPage'
import GenePage from './components/loadURLs/genePage'


function App() {

  return (
    <main className="App">
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
