// Isolate search filters (complex enough to warrant their own file)
import { useState } from 'react'

const maxContigs = 50
const minYear = 1950
const thisYear = new Date().getFullYear()

const Checkbox = ({ label, value, onChange }) => (
  <div className='form-check mr-4'>
    <input
      type='checkbox'
      id={`checkbox-${label}`}
      className='form-check-input'
      checked={value}
      onChange={e => {
        onChange(e.target.checked)
      }}
    />
    <label className='form-check-label' htmlFor={`checkbox-${label}`}>
      {label}
    </label>
  </div>
)

const SearchFilters = ({ formState, setFormState }) => {
  const setMinMaxContigs = ({ min: rawMin, max: rawMax }) => {
    const min = rawMin != null ? rawMin : formState.searchFilters.minN50
    const max = rawMax != null
      ? rawMax
      : (
          formState.searchFilters.noContigs === 'All'
            ? maxContigs
            : formState.searchFilters.noContigs
        )

    const newMin = rawMin == null
      ? Math.min(initialMinMaxContigs.min, max)
      : min

    const newMax = rawMax == null
      ? Math.max(min, initialMinMaxContigs.max)
      : max

    setFormState({
      searchFilters: {
        minN50: newMin,
        noContigs: newMax === maxContigs ? 'All' : newMax
      }
    })
  }

  const minContig = formState.searchFilters.minN50
  const maxContig = formState.searchFilters.noContigs === 'All'
    ? maxContigs
    : formState.searchFilters.noContigs
  const [initialMinMaxContigs, setInitialMinMaxContigs] = useState({
    min: minContig,
    max: maxContig
  })
  const applyInitialMinMaxContigs = (() => {
    const onEvent = () => setInitialMinMaxContigs({
      min: minContig,
      max: maxContig
    })
    return {
      onMouseDown: onEvent,
      onKeyDown: onEvent,
      onTouchStart: onEvent
    }
  })()

  return (
    <>
      <h6>Filters</h6>
      <div className='d-flex'>
        <Checkbox
          label='Assemblies'
          value={formState.searchFilters.assemblies}
          onChange={assemblies => {
            setFormState({
              searchFilters: {
                assemblies
              }
            })
          }}
        />
        <Checkbox
          label='Reads'
          value={formState.searchFilters.reads}
          onChange={reads => {
            setFormState({
              searchFilters: {
                reads
              }
            })
          }}
        />
      </div>
      <div className='d-flex'>
        <div
          className='flex-fill mx-2'
          style={{
            maxWidth: '200px'
          }}
        >
          <label htmlFor='minContig'>Min Contigs: {minContig}</label>
          <input
            id='minContig'
            className='display-block form-range custom-range'
            type='range'
            step={1}
            min={0}
            max={50}
            value={minContig}
            {...applyInitialMinMaxContigs}
            onChange={e => {
              setMinMaxContigs({
                min: +e.target.value
              })
            }}
          />
        </div>
        <div
          className='flex-fill mx-2'
          style={{
            maxWidth: '200px'
          }}
        >
          <label htmlFor='minContig'>Max Contigs: {formState.searchFilters.noContigs}</label>
          <input
            className='display-block form-range custom-range'
            type='range'
            step={1}
            min={0}
            max={50}
            value={maxContig}
            {...applyInitialMinMaxContigs}
            onChange={e => {
              setMinMaxContigs({
                max: +e.target.value
              })
            }}
          />
        </div>
      </div>

      <div className='d-flex flex-wrap'>
        <div className='mr-4 d-flex flex-column justify-content-end'>
          <label htmlFor='fromYear'>From Year</label>
          <input
            id='fromYear'
            name='fromYear'
            className='d-block form-control'
            type='number'
            min={minYear}
            max={thisYear}
            value={formState.searchFilters.Year[0]}
            onChange={e => {
              const value = +e.target.value
              setFormState({
                searchFilters: {
                  Year: [
                    value,
                    Math.max(value, formState.searchFilters.Year[1])
                  ]
                }
              })
            }}
          />
        </div>
        <div className='mr-4 d-flex flex-column justify-content-end'>
          <label htmlFor='toYear'>To Year</label>
          <input
            id='toYear'
            name='toYear'
            className='d-block form-control'
            type='number'
            min={minYear}
            max={thisYear}
            value={formState.searchFilters.Year[1]}
            onChange={e => {
              const value = +e.target.value
              setFormState({
                searchFilters: {
                  Year: [
                    Math.min(value, formState.searchFilters.Year[0]),
                    value
                  ]
                }
              })
            }}
          />
        </div>
        <div className='d-flex flex-column justify-content-end'>
          <label htmlFor='sampleCountry'>Sample country</label>
          <input
            className='d-block form-control'
            id='sampleCountry'
            name='sampleCountry'
            value={formState.searchFilters.Country}
            onChange={e => {
              setFormState({
                searchFilters: {
                  Country: e.target.value
                }
              })
            }}
          />
        </div>
      </div>

    </>
  )
}

export default SearchFilters
