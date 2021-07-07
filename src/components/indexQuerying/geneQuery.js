async function geneQuery (formData) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }
  const fetchResponse = await window.fetch('https://bacquerya.azurewebsites.net:443/geneQuery', fetchData)
  const resolvedResponse = await fetchResponse.json()
  return {
    resultCount: resolvedResponse.resultCount,
    searchResult: resolvedResponse.searchResult
  }
};

export function geneAlignment (geneConsistentName) {
  return window.fetch(
    `https://bacquerya.azurewebsites.net:443/alignmentView/${geneConsistentName}`,
    {
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
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