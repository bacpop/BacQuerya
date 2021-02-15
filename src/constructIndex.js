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

function constructIndex() {

  const [formData, updateFormData] = useState(null);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = (e) => {
    fetch("http://localhost:5000/JSON", {
          method: 'POST',
          mode: 'cors',
          headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'searchTerm': formData}),
          }).then((response) => response.json()).then((responseJson) => {
        const isolateJSON = JSON.parse(responseJson);

        for (var i in isolateJSON.information) {
          console.log(isolateJSON.information[i]);
          client.index({
            index: "isolate-features-spc",
            type: "doc",
            refresh: true,
            body: isolateJSON.information[i]
            }).then(function (resp) {
              }, function (err) {
                console.log(err.message);
          });
       };
    });

    e.preventDefault()
    console.log(formData);
  };

  return (
    <div className="App">
      <InputGroup className="mb-3">
        <FormControl
          name="searchTerm"
          placeholder="Search term"
          aria-label="Search term"
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
        <InputGroup.Append>
          <Button onClick={handleSubmit} variant="outline-primary">Search</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default constructIndex;
