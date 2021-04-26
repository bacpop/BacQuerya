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
                "size" : 616,
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
                            "BioSample",
                            "Organism_name"
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

export async function specificIsolateQuery(accessionList) {
    const searchURL = process.env.REACT_APP_API_URL + "/sparc_isolate_index/_search";
    const apiKey = process.env.REACT_APP_API_KEY;
    var responseList = await Promise.all(accessionList.map(biosampleAccession => {
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
                                    "BioSample": biosampleAccession
                                }
                            }
                        ]
                    }
                }
            })
        };
        return fetch(searchURL, fetchData).then(
            (response) => response.json()).then(
                (responseJson) => {
                    return responseJson.hits.hits[0]
                }
            );
    }));
    const filteredResults = await responseList.filter(function( obj ) {
        if (obj === undefined) {
            return false; // skip
        };
        return true;
    });
    console.log(filteredResults)
    return filteredResults;
};

export default isolateQuery;