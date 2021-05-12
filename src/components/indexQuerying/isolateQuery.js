async function isolateQuery(formData) {
    const fetchData =  {
        method: 'POST',
        mode: 'cors',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'searchTerm': formData, "searchType": "isolate"}),
      };
    const fetchResponse = await fetch("http://127.0.0.1:5000/isolateQuery", fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse.searchResult;
};

export async function specificIsolateQuery(accessionList) {
    const fetchData =  {
        method: 'POST',
        mode: 'cors',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'searchTerm': accessionList, "searchType": "biosampleList"}),
      };
    const fetchResponse = await fetch("http://127.0.0.1:5000/isolateQuery", fetchData);
    const resolvedResponse = await fetchResponse.json();
    const filteredResults = await resolvedResponse.searchResult.filter(function( obj ) {
        if (obj === null) {
            return false; // skip
        };
        return true;
    });
    console.log(filteredResults)
    return filteredResults;
};

export default isolateQuery;