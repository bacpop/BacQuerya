import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import Header from './components/header'
import SearchPageBase from './components/searchPage'
import StudyPageBase from './components/loadURLs/studyPage'
import GenePageBase from './components/loadURLs/genePage'
import IsolatePageBase from './components/loadURLs/isolatePage'
import SubmissionPageBase from './components/displayPages/submissionDisplay'

const createTitleWrapper = (Component, title = 'Bacquerya') => (props) => {
  useEffect(() => {
    document.title = title
  }, [])
  return <Component {...props} />
}

const SearchPage = createTitleWrapper(SearchPageBase, 'Bacquerya - Search')
const StudyPage = createTitleWrapper(StudyPageBase, 'Bacquerya - Study')
const GenePage = createTitleWrapper(GenePageBase, 'Bacquerya - Gene')
const IsolatePage = createTitleWrapper(IsolatePageBase, 'Bacquerya - Isolate')
const SubmissionPage = createTitleWrapper(SubmissionPageBase, 'Bacquerya - Submit')

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
          <Route exact path='/submit/:encodedDOI/' component={SubmissionPage} />
        </Router>
      </main>
    </>
  )
};

export default App
