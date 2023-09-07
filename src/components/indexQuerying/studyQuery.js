async function studyQuery (formData) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({'searchTerm': formData, 'source': 'searchBar'}),
    body: JSON.stringify(formData)
  }
  const fetchResponse = await window.fetch(`${process.env.REACT_APP_URL_HOST}:${process.env.REACT_APP_URL_PORT}/study`, fetchData)
  const resolvedResponse = await fetchResponse.json()
  return {
    resultCount: resolvedResponse.resultCount == null
      ? -1
      : resolvedResponse.resultCount,
    searchResult: resolvedResponse.result
  }
}

export default studyQuery

export async function assignStudyAccessions(uploadedFile) {
  const data = new FormData();
  data.append('file', uploadedFile);
  fetch(`${process.env.REACT_APP_URL_HOST}:${process.env.REACT_APP_URL_PORT}/upload_accessions`, {
      method: 'POST',
      body: data,
      });
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