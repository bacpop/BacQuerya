async function paperQuery(formData) {
  const fetchData =  {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({'searchTerm': formData, 'source': 'searchBar'}),
  };
  const fetchResponse = await fetch('https://bacquerya.azurewebsites.net:443/paper', fetchData);
  const resolvedResponse = await fetchResponse.json();
  return resolvedResponse.result
}

export default paperQuery;