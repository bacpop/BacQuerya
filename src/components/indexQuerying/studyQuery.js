async function studyQuery(formData) {
  const fetchData =  {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({'searchTerm': formData, 'source': 'searchBar'}),
  };
  const fetchResponse = await fetch('https://bacquerya.azurewebsites.net:443/study', fetchData);
  const resolvedResponse = await fetchResponse.json();
  return resolvedResponse.result
}

export default studyQuery;

export function assignStudyAccessions(fieldValues, encodedDOI, decodedDOI) {
  fieldValues.studyDOI = decodedDOI
  const searchURL = process.env.REACT_APP_API_URL + "/sparc_study_index/_doc/" + encodedDOI;
  const apiKey = process.env.REACT_APP_study_API_KEY;

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

export async function queryStudyIsolates(studyDOI) {
  const searchURL = process.env.REACT_APP_API_URL + "/sparc_study_index/_search";
  const apiKey = process.env.REACT_APP_study_API_KEY;
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
                              "studyDOI": studyDOI
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