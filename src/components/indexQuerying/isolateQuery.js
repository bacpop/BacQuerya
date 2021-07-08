async function isolateQuery (formData) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }
  const fetchResponse = await window.fetch('https://bacquerya.azurewebsites.net:443/isolateQuery', fetchData)
  const resolvedResponse = await fetchResponse.json()
  return {
    resultCount: resolvedResponse.resultCount,
    searchResult: resolvedResponse.searchResult
  }
};

export const populationAssemblyStats = ((species) => {
  // This endpoint's result never changes, so cache it in memory to save load time
  let promise
  return async (species) => {
    if (!promise) {
      promise = window.fetch('https://bacquerya.azurewebsites.net:443/population_assembly_stats/' + species, {
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(raw => raw.json())
    }
    return promise
  }
})()

export const histogramIntervalCount = 30

const formatForHistogram = (groupProp, roundDigits, species) => {
  return populationAssemblyStats(species)
    .then(data => {
      let min = Infinity
      let max = 0

      const expandContractAmt = Math.pow(10, roundDigits || 0)
      const expand = val => +val / expandContractAmt
      const contract = val => +val * expandContractAmt

      // First pass: get the min and max contig values
      Object.values(data).forEach(({ [groupProp]: val }) => {
        const v = expand(val)
        min = Math.min(min, v)
        max = Math.max(max, v)
      })

      // Second pass, group all values
      const groups = Array.from(new Array(histogramIntervalCount)).map(_ => [])
      Object.entries(data).forEach(([key, value], index) => {
        const isolate = key.split('#')[0]

        groups[
          Math.min(
            Math.floor(
              ((expand(value[groupProp]) - min) / (max - min)) * histogramIntervalCount
            ),
            histogramIntervalCount - 1
          )
        ].push({
          ...value,
          isolate
        })
      })

      return {
        min: contract(min),
        max: contract(max),
        groups
      }
    })
  }

export const populationAssemblyStatsN50 = (species) => {
  return formatForHistogram('contig_N50', 0, species)
}

export const populationAssemblyStatsGcContent = (species) => {
  return formatForHistogram('gc_content', -6, species)
}

export const populationAssemblyTotalBps = (species) => {
  return formatForHistogram('genome_length', -6, species)
}

export const populationAssemblyContigCount = (species) => {
  return formatForHistogram('contig_count', -6, species)
}

export async function specificIsolateQuery (accessionList) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ searchTerm: accessionList, searchType: 'biosampleList' })
  }
  const fetchResponse = await window.fetch('https://bacquerya.azurewebsites.net:443/isolateQuery', fetchData)
  const resolvedResponse = await fetchResponse.json()
  const filteredResults = await resolvedResponse.searchResult.filter(function (obj) {
    if (obj === null) {
      return false // skip
    };
    return true
  })
  return filteredResults
};

export default isolateQuery
