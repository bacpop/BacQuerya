import {useState, useEffect} from 'react';
import elasticsearch from "elasticsearch";
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

import IsolateDisplay from '../isolateDisplay'

function IsolateQuery(props) {

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();
    const [selectedIsolate, selectIsolate] = useState(null);

    var client = new elasticsearch.Client({ host: 'localhost:9200', log: 'error' }) //locallyhosted elasticsearch index
    // Check if Connection is ok or not
    client.ping({
        requestTimeout: Infinity,
        }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    });

    useEffect(() => {
        (async () => {
            await client.indices.refresh({ index: 'python_isolate_index4' })
            await client.search({
            index: "python_isolate_index4",
            type: "_doc",
            body: {
                query : {
                    multi_match : {
                        "query": props.searchTerm,
                        "fields": [
                            "isolateName",
                            "Assembly_name",
                            "Infraspecific_name",
                            "GenBank_assembly_accession",
                            "RefSeq_assembly_and_GenBank_assemblies_identical",
                            "BioSample"
                        ],
                        "operator": "or",
                        "fuzziness" : "AUTO",
                      },
                }
            }
            }).then(function (resp) {
                const resultArray = [];
                for (var i in resp.hits.hits) {
                    var name = resp.hits.hits[i]._source
                    resultArray.push((name));
                }
                console.log(resultArray)
                updateResult(resultArray);
                setSearched(true)
            }, function (err) {
                console.log(err.message);
            });
        })();
      }, [updateResult, setSearched]);

    function displayResults() {
        selectIsolate(null);
    };

    const renderResult = results =>
        results.map(result =>
            <li>
                <Link to={"/isolate/" + result.BioSample} onClick={() => selectIsolate(result.BioSample)}>{result.BioSample}</Link>
            </li>
            );

    return (
        <div className="search_results">
            {(searched === true && selectedIsolate === null && searchResult.length > 0) && <ul>{renderResult(searchResult)}</ul>}
            {(searched === true && selectedIsolate === null && searchResult.length === 0) && <p>No result...</p>}
            {(selectedIsolate !== null) &&
                <div>
                    <Button onClick={displayResults} variant="primary">Back to search results</Button>
                </div>
            }
        </div>
    );
};

export default IsolateQuery;
