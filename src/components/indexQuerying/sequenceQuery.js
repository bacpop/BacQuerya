async function sequenceQuery(formData) {
  const fetchData =  {
    method: 'POST',
    mode: 'cors',
    headers : {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({'searchTerm': formData}),
  };
  const fetchResponse = await fetch("http://127.0.0.1:5000/sequence", fetchData);
  const resolvedResponse = await fetchResponse.json();
  return resolvedResponse.resultMetrics
}

export default sequenceQuery;