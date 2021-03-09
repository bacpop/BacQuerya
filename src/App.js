import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import HomePage from './components/homePage'
import SearchPage from './components/searchPage'
import IsolatePage from './components/isolatePage'
import PaperPage from './components/paperPage'

function App() {

  return (
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/search" component={SearchPage} />
        <Route path="/isolate/:BioSample" component={IsolatePage} />
        <Route path="/paper/:encodedDOI" component={PaperPage} />
      </Router>
  );
};

export default App;
