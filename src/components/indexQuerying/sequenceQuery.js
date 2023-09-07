async function sequenceQuery(formData) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }
  const fetchResponse = await window.fetch(`${process.env.REACT_APP_URL_HOST}:${process.env.REACT_APP_URL_PORT}/sequence`, fetchData)
  const resolvedResponse = await fetchResponse.json()
  return {
    resultCount: resolvedResponse.resultCount == null
      ? -1
      : resolvedResponse.resultCount,
    searchResult: resolvedResponse.resultMetrics
  }
}

export default sequenceQuery
