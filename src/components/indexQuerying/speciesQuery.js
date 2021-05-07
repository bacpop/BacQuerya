async function speciesQuery(genusSpecies) {
    const searchURL = process.env.REACT_APP_API_URL + "/isolate_index_3/_search";
    const apiKey = process.env.REACT_APP_API_KEY;
    const fetchData =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({
                "size" : 1000,
                "query" : {
                    "match" : {
                        "Organism_name" : genusSpecies
                        }
                }
        })
    };
    const fetchResponse = await fetch(searchURL, fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse.hits.hits
};

  export default speciesQuery;