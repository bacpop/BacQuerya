import {useState, useEffect} from 'react';
import elasticsearch from "elasticsearch";
import '../../App.css';

function PaperQuery(props) {

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

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
            await client.indices.refresh({ index: 'isolates' })
            await client.search({
            index: "isolates",
            type: "doc",
            body: {
                query : {
                    multi_match : {
                        "query": props.searchTerm,
                        "type": "cross_fields",
                        "fields": ["isolateName", "Assembly_name", "Infraspecific_name", "GenBank_assembly_accession", "RefSeq_assembly_and_GenBank_assemblies_identical"],
                        "operator": "or"
                      }
                }
            }
            }).then(function (resp) {

                const resultArray = [];
                for (var i in resp.hits.hits) {
                var name = resp.hits.hits[i]._source
                resultArray.push((name));
                }
                console.log(resultArray);
                updateResult(resultArray);
                setSearched(true)
            }, function (err) {
                console.log(err.message);
            });
        })();
      }, [updateResult, setSearched]);

    const renderResult = results =>
        results.map(result => <p key={result.index}>{result.isolateName}</p>);

    return (
        <div className="search_results">
            {(searched === true && searchResult.length > 0) && <ul>{renderResult(searchResult)}</ul>}
            {(searched === true && searchResult.length === 0) && <p>No result...</p>}
        </div>
    );
};

export default PaperQuery;