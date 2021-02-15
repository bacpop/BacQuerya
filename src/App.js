import {useState} from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import elasticsearch from "elasticsearch";

var client = new elasticsearch.Client({ host: 'localhost:9200', log: 'error' })

// Check if Connection is ok or not
client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,
}, function (error) {
  if (error) {
     console.trace('elasticsearch cluster is down!');
  } else {
      console.log('All is well');
  }
});

function App() {

  const [formData, updateFormData] = useState(null);
  const [searchResult, updateResult] = useState(null);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getResult = async () => {
    await client.indices.refresh({ index: 'isolate-features-spc' })
    await client.search({
      index: "isolate-features-spc",
      type: "doc",
      body: {query : {match : {isolateName: formData.searchTerm}}}
      }).then(function (resp) {
        
        const resultArray = [];
        for (var i in resp.hits.hits) {
          var name = resp.hits.hits[i]._source.isolateName
          resultArray.push((name + "\n"));
        }
        console.log(resultArray);
        updateResult(resultArray);
      }, function (err) {
          console.log(err.message);
      });
  };

  return (
    <div className="App">
      <>
        <InputGroup className="mb-3">
          <FormControl
            name="searchTerm"
            placeholder="Search term"
            aria-label="Search term"
            aria-describedby="basic-addon2"
            onChange={handleChange}
          />
          <InputGroup.Append>
            <Button onClick={getResult} variant="outline-primary">Search</Button>
          </InputGroup.Append>
        </InputGroup>
        <div>
          { (searchResult===null) && <p>No result...</p> }
          { (searchResult!==null) && <p> {searchResult}</p> }
        </div>
      </>
    </div>
  );
};

export default App;
