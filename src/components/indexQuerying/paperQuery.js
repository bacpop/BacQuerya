async function paperQuery(formData) {
  const fetchData =  {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({'searchTerm': formData, 'source': 'searchBar'}),
  };
  const fetchResponse = await fetch('https://bacquerya.azurewebsites.net:443/paper', fetchData);
  const resolvedResponse = await fetchResponse.json();
  return resolvedResponse.result
}

export default paperQuery;

export function assignPaperAccessions(fieldValues, encodedDOI, decodedDOI) {
  fieldValues.paperDOI = decodedDOI
  const searchURL = process.env.REACT_APP_API_URL + "/sparc_paper_index/_doc/" + encodedDOI;
  const apiKey = process.env.REACT_APP_PAPER_API_KEY;

  const postData =  {
      method: 'POST',
      headers : {
          'Authorization': 'ApiKey ' + apiKey,
          'Content-Type': 'application/json'
      },
      body:
          JSON.stringify(fieldValues)
  };
fetch(searchURL, postData);
};

export async function queryPaperIsolates(paperDOI) {
  const searchURL = process.env.REACT_APP_API_URL + "/sparc_paper_index/_search";
  const apiKey = process.env.REACT_APP_PAPER_API_KEY;
  const fetchData =  {
      method: 'POST',
      headers : {
          'Authorization': 'ApiKey ' + apiKey,
          'Content-Type': 'application/json'
      },
      body:
          JSON.stringify({
              "query": {
                  "bool": {
                      "must": [{
                          "match": {
                              "paperDOI": paperDOI
                          }
                      }
                  ]
              }
          }
      })
  };
  const fetchResponse = await fetch(searchURL, fetchData);
  const resolvedResponse = await fetchResponse.json();
  console.log(resolvedResponse)
  return resolvedResponse.hits.hits;
};