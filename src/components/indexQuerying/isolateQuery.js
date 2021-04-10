async function isolateQuery(formData) {
    const searchURL = process.env.REACT_APP_API_URL + "/sparc_isolate_index/_search";
    const apiKey = process.env.REACT_APP_API_KEY;
    const fetchData =  {
        method: 'POST',
        headers : {
            'Authorization': 'ApiKey ' + apiKey,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({
                "size" : 100,
                "query" : {
                    "multi_match" : {
                        "query" : formData,
                        "fields" : [
                            "isolateName",
                            "isolateNameUnderscore",
                            "Assembly_name",
                            "Infraspecific_name",
                            "GenBank_assembly_accession",
                            "RefSeq_assembly_and_GenBank_assemblies_identical",
                            "BioSample"
                        ],
                        "operator": "or",
                        "fuzziness": "AUTO",
                        },
                }
        })
    };
    const fetchResponse = await fetch(searchURL, fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse
};

  export default isolateQuery;