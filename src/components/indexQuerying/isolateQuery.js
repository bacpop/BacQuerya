async function isolateQuery(formData, filters) {
    const fetchData =  {
        method: 'POST',
        mode: 'cors',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'searchTerm': formData, "searchType": "isolate", "searchFilters": filters}),
      };
    const fetchResponse = await fetch("https://bacquerya.azurewebsites.net:443/isolateQuery", fetchData);
    const resolvedResponse = await fetchResponse.json();
    return resolvedResponse.searchResult;
};

export const populationAssemblyStats = (() => {
  // This endpoint's result never changes, so cache it in memory to save load time
  let promise
  return async () => {
    if (!promise) {
      promise = window.fetch('https://bacquerya.azurewebsites.net/population_assembly_stats', {
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(raw => raw.json())
        .then(data => {
          const intervalCount = 30
          let minContigN50 = Infinity
          let maxContigN50 = 0

          // First pass: get the min and max contig values
          Object.values(data).forEach(({ contig_N50: contig }) => {
            minContigN50 = Math.min(minContigN50, contig)
            maxContigN50 = Math.max(maxContigN50, contig)
          })

          // Second pass, group all values
          const groups = Array.from(new Array(intervalCount)).map(_ => [])
          Object.entries(data).forEach(([key, value]) => {
            const isolate = key.split('#')[0]
            groups[
              Math.floor(((value.contig_N50 - minContigN50) / maxContigN50) * intervalCount)
            ].push({
              ...value,
              isolate
            })
          })

          return {
            min: minContigN50,
            max: maxContigN50,
            groups
          }
        })
    }
    return promise
  }
})()

export async function specificIsolateQuery(accessionList) {
    const fetchData =  {
        method: 'POST',
        mode: 'cors',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'searchTerm': accessionList, "searchType": "biosampleList"}),
      };
    const fetchResponse = await fetch("https://bacquerya.azurewebsites.net:443/isolateQuery", fetchData);
    const resolvedResponse = await fetchResponse.json();
    const filteredResults = await resolvedResponse.searchResult.filter(function( obj ) {
        if (obj === null) {
            return false; // skip
        };
        return true;
    });
    console.log(filteredResults)
    return filteredResults;
};

export default isolateQuery;