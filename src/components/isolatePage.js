import { useState, useEffect } from "react";
import elasticsearch from "elasticsearch";

import IsolateDisplay from './isolateDisplay'

const IsolatePage = ({ match }) => {
    const {
        params: { BioSample },
    } = match;

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
            await client.indices.refresh({ index: 'python_isolate_index4' })
            await client.search({
            index: "python_isolate_index4",
            type: "_doc",
            body: {
                query: {
                  match: {
                    BioSample: BioSample
                  }
                }
            }}
            ).then(function (resp) {
                updateResult(resp.hits.hits[0]._source);
                setSearched(true)
            }, function (err) {
                console.log(err.message);
            });
        })();
      }, [updateResult, setSearched]);

      return (
        <div className="search_results">
            {searched === true &&
                <div>
                    <IsolateDisplay isolateInfo={searchResult} />
                </div>
            }
        </div>
    );
  };

export default IsolatePage;