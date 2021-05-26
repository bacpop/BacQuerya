async function speciesQuery(genusSpecies) {
    const fetchData =  {
        method: 'POST',
        mode: 'cors',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'searchTerm': genusSpecies, "searchType": "species"}),
      };
    const fetchResponse = await fetch("http://127.0.0.1:5000/isolateQuery", fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse.searchResult;
};

export default speciesQuery;