import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

import "../CSS/searchFilters.css"

const applyFilters = (searchResults, filters) => {
    const assemblies = filters.assemblies
    const reads = filters.reads
    const minN50 = filters.minN50
    var noContigs = filters.noContigs
    if (noContigs == "All") {
        noContigs = 1000000
    };
    if (assemblies === true && reads === false) {
        return searchResults.filter(function( obj ) {
            return obj._source.Genome_representation !== 'reads' && obj._source.contig_stats.N50 >= minN50 && obj._source.contig_stats.sequence_count <= noContigs;
        });
    };
    if (assemblies === false && reads === true) {
        return searchResults.filter(function( obj ) {
            return obj._source.Genome_representation !== 'full';
        });
    };
    if (assemblies === true && reads === true) {
        return searchResults.filter(function( obj ) {
            if (obj._source.contig_stats) {
                return obj._source.contig_stats.N50 >= minN50 && obj._source.contig_stats.sequence_count <= noContigs;
            };
            if (obj._source.contig_stats == undefined) {
                return obj
            };
        });
    };
};

export function filterResults(searchResults, queryType, filters) {
    if (queryType === "isolate") {
        const filteredResults = applyFilters(searchResults, filters)
        const sequenceURLs = filteredResults.map(result => result._source.sequenceURL)
        var flattenedSequenceURLs = [].concat.apply([], sequenceURLs);
        return [filteredResults, flattenedSequenceURLs]
    }
    if (queryType !== "isolate") {
        const filteredResults = searchResults;
        return filteredResults
    }
}


export function FilterComponent(props) {

    const [sliderValue, setSliderValue] = useState(props.selectedFilters.minN50);
    const [contigValue, setContigValue] = useState(props.selectedFilters.noContigs);

    function getFilters(e) {
        e.preventDefault()
        props.setSelectedFilters(
            {assemblies: e.target.assemblies.checked,
            reads: e.target.reads.checked,
            minN50: sliderValue,
            noContigs: contigValue})
        props.setOpenFilters(false)
    }

    return (
            <div className="filterOptions-options">
                <Form onSubmit={getFilters}>
                    <div className="filterOptions-options-item">
                        <Form.Check type="checkbox" name="assemblies" label="Assemblies" defaultChecked={props.selectedFilters.assemblies}/>
                    </div>
                    <div className="filterOptions-options-item">
                        <Form.Check type="checkbox" name="reads" label="Reads" defaultChecked={props.selectedFilters.reads}/>
                    </div>
                    <div className="filterOptions-options-slider-container">
                        <div className="slider-label" id="slider-label-font">
                            <Form.Label> Minimum N50 </Form.Label>
                        </div>
                        <div className="slider">
                            <Form.Control type="range" name="N50Slider" min={0} max={100000} value={sliderValue} onChange={e => setSliderValue(e.target.value)}/>
                        </div>
                        <div className="slider-input">
                            <Form.Control size="sm" name="N50Input" value={sliderValue} onChange={e => setSliderValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="filterOptions-options-contigs-container">
                        <Form.Label className="contig-label" id="contig-label-font"> Maximum number of contigs </Form.Label>
                        <Form.Control className="contig-input" size="sm" name="noContigs" value={contigValue} onChange={e => setContigValue(e.target.value)}/>
                    </div>
                    <Button className="filterOptions-options-button" variant="outline-primary" type="submit">Apply filters</Button>
                </Form>
            </div>
    )
}