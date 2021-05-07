async function geneQuery(formData) {
    const searchURL = process.env.REACT_APP_API_URL + "/gene_index_3/_search";
    const apiKey = process.env.REACT_APP_API_KEY;
    const fetchData =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({
                "size" : 5433,
                "query" : {
                    "multi_match" : {
                        "query" : formData,
                        "fields" : [
                            "consistentNames",
                            "panarooDescriptions",
                            "pfam_descriptions"
                        ],
                        "operator": "or",
                        "fuzziness": "AUTO",
                        },
                }
        })
    };
    const fetchResponse = await fetch(searchURL, fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse.hits.hits
};

  export default geneQuery;