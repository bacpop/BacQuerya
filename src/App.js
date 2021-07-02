import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import Header from './components/header'
import SearchPage from './components/searchPage'
import StudyPage from './components/loadURLs/studyPage'
import GenePage from './components/loadURLs/genePage'
import SpeciesPage from './components/loadURLs/speciesPage'
import GenusPage from './components/loadURLs/genusPage'
import IsolatePage from './components/loadURLs/isolatePage'
import submissionPage from './components/displayPages/submissionDisplay'

function App () {
  return (
    <>
      <Header />
      <main className='App'>
        <Router>
          <Route exact path='/' component={SearchPage} />
          <Route exact path='/study/:encodedDOI' component={StudyPage} />
          <Route exact path='/gene/:geneName' component={GenePage} />
          <Route exact path='/isolate/:Genus/:Species/:BioSample' component={IsolatePage} />
          <Route exact path='/isolate/:Genus/:Species' component={SpeciesPage} />
          <Route exact path='/isolate/:Genus/' component={GenusPage} />
          <Route exact path='/submit/:encodedDOI/' component={submissionPage} />
        </Router>
      </main>
    </>
  )
};

export default App
