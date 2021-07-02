import { useState, useEffect } from 'react'

import GeneDisplay from '../displayPages/geneDisplay'
import { specificGeneQuery } from '../indexQuerying/geneQuery'

const GenePage = ({ match }) => {
  const {
    params: { geneName }
  } = match

  const [searchResult, updateResult] = useState()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) {
      return
    }
    specificGeneQuery([].concat(geneName)).then((responseJson) => {
      setLoaded(true)
      updateResult(responseJson[0]?._source)
    })
  }, [geneName, updateResult, loaded, setLoaded])

  return (
    <div className='search_results'>
      <GeneDisplay
        geneInfo={searchResult}
        noResults={loaded && !searchResult}
      />
    </div>
  )
}

export default GenePage
