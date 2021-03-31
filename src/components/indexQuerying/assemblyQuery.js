import React, { useState } from 'react';

function UploadAssembly(props) {
    const [FileMetadata, setFileMetadata] = useState(null)

    const postAssem = (e) => {
        e.preventDefault()
        setFileMetadata(e.target.files[0])
    };

    if (props.postAssembly===true) {
        const dataFile = new FormData()
        dataFile.append('file', FileMetadata);
        dataFile.append('filename', FileMetadata.name);
        console.log(dataFile)
        fetch('https://bacquerya.azurewebsites.net:443/assembly', {
            method: 'POST',
            body: dataFile
            }).then((response) => response.json()).then((responseJson) => {
              console.log(responseJson.result)
          });
    };

    return(
        <div>
            <input onChange={postAssem} type="file" />
        </div>
    )
}
export default UploadAssembly;