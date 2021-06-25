async function geneQuery (formData) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({'searchTerm': formData, "searchType": "gene"}),
    body: JSON.stringify(formData)
  }
  const fetchResponse = await window.fetch('https://bacquerya.azurewebsites.net:443/geneQuery', fetchData)
  const resolvedResponse = await fetchResponse.json()
  return resolvedResponse.searchResult
};

export function geneAlignment () {
  return window.fetch(
    'https://bacquerya.azurewebsites.net:443/alignmentView/example',
    {
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }
  ).then(response => response.json())
}

export async function specificGeneQuery(accessionList) {
    const fetchData =  {
        method: 'POST',
        mode: 'cors',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'searchTerm': accessionList, "searchType": "consistentNameList"}),
      };
    const fetchResponse = await fetch("https://bacquerya.azurewebsites.net:443/geneQuery", fetchData);
    const resolvedResponse = await fetchResponse.json();
    const filteredResults = await resolvedResponse.searchResult.filter(function( obj ) {
        if (obj === null) {
            return false; // skip
        };
        return true;
    });
    return filteredResults;
};

export default geneQuery;