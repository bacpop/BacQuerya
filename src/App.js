import React from 'react';
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

class App extends React.Component {

  onChange(event) {
    // Intended to run on the change of every form element
    event.preventDefault()
    this.setState({
        [event.target.name]: event.target.value,
    })
  };
  
  handleSave() {
    fetch("http://localhost:5000/JSON", {
          method: 'POST',
          mode: 'cors',
          headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'searchTerm': this.state.searchTerm}),
          }).then((response) => response.json()).then((responseJson) => {
        const isolateJSON = JSON.parse(responseJson);
        
        const payload = {
          "isolate": isolateJSON.isolateName,
          "features": isolateJSON.features,
        }
        console.log(payload)
        client.index({
            index: "isolates",
            type: "doc",
            refresh: true,
            body: payload
        }).then(function (resp) {
        }, function (err) {
            console.log(err.message);
        });
      });
    };

  render() {
    return (
      <div className="App">
        <InputGroup className="mb-3">
          <FormControl
            name="searchTerm"
            placeholder="Search term"
            aria-label="Search term"
            aria-describedby="basic-addon2"
            onChange={this.onChange.bind(this)}
          />
          <InputGroup.Append>
            <Button onClick={this.handleSave.bind(this)} variant="outline-primary">Search</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  };
};

export default App;
