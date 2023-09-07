import { useState, useEffect } from "react";

import StudyDisplay from '../displayPages/studyDisplay'

const StudyPage = ({ match }) => {
    const {
        params: { encodedDOI },
    } = match;

    const [searched, setSearched] = useState(false)
    const [searchResult, updateResult] = useState();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_URL_HOST}:${process.env.REACT_APP_URL_PORT}/study`, {
            method: 'POST',
            mode: 'cors',
            headers : {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'searchTerm': encodedDOI, 'source': 'URL'}),
            }).then((response) => response.json()).then((responseJson) => {
                updateResult(responseJson.result[0])
                setSearched(true)
          });
      }, [updateResult, setSearched]);

      return (
        <div className="">
            {searched === true &&
                <div>
                    <StudyDisplay studyInfo={searchResult} />
                </div>
            }
        </div>
    );
  };

export default StudyPage;