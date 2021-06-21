async function isolateQuery (formData, filters) {
  const fetchData = {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ searchTerm: formData, searchType: 'isolate', searchFilters: filters })
  }
  const fetchResponse = await fetch('https://bacquerya.azurewebsites.net:443/isolateQuery', fetchData)
  const resolvedResponse = await fetchResponse.json()
  return resolvedResponse.searchResult
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
        .then(d => {
          // console.log('popAssembStats', d)
          console.log(Object.values(d).slice(0, 3))
          return d
        })
    }
    return promise
  }
})()

export const histogramIntervalCount = 30

const formatForHistogram = (groupProp, roundDigits) =>
  populationAssemblyStats()
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

export const populationAssemblyStatsN50 = () =>
  formatForHistogram('contig_N50')

export const populationAssemblyStatsGcContent = () =>
  formatForHistogram('gc_content', -6)

export const populationAssemblyTotalBps = () =>
  formatForHistogram('genome_length', -6)

export const populationAssemblyContigCount = () =>
  formatForHistogram('contig_count', -6)

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
  console.log(filteredResults)
  return filteredResults
};

export default isolateQuery
