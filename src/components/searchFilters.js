import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

import "../CSS/searchFilters.css"

const intConverter = value =>{
    if (value === "All") {
        return value;
    };
    return Number(value);
};

export function FilterComponent(props) {

    const [sliderValue, setSliderValue] = useState(props.selectedFilters.minN50);
    const [contigValue, setContigValue] = useState(props.selectedFilters.noContigs);
    const [countryValue, setCountryValue] = useState(props.selectedFilters.Country);
    const [yearValue, setYearValue] = useState(props.selectedFilters.Year);

    function getFilters(e) {
        e.preventDefault()
        props.setSelectedFilters(
            {assemblies: e.target.assemblies.checked,
            reads: e.target.reads.checked,
            minN50: Number(sliderValue),
            noContigs: intConverter(contigValue),
            Country: countryValue,
            Year: yearValue})
        props.setOpenFilters(false)
        props.setSearch(true)
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
                        <div className="slider-label" id="mediumLarge-font">
                            <Form.Label> Minimum N50 </Form.Label>
                        </div>
                        <div className="slider">
                            <Form.Control disabled style={{width: (window.innerWidth*0.0656) + "px", height: (1.64 + "vh")}} type="range" name="N50Slider" min={0} max={100000} value={sliderValue} onChange={e => setSliderValue(e.target.value)}/>
                        </div>
                        <div className="slider-input">
                            <Form.Control disabled size="sm" name="N50Input" value={sliderValue} onChange={e => setSliderValue(e.target.value)} id="mediumLarge-font"/>
                        </div>
                    </div>
                    <div className="filterOptions-options-contigs-container">
                        <Form.Label className="contig-label" id="mediumLarge-font"> Maximum number of contigs </Form.Label>
                        <Form.Control className="contig-input" size="sm" name="noContigs" value={contigValue} onChange={e => setContigValue(e.target.value)} id="mediumLarge-font"/>
                    </div>
                    <div className="filterOptions-options-year-container">
                        <Form.Label className="year-label" id="mediumLarge-font">Sample years</Form.Label>
                        <Form.Control className="year-input" size="sm" name="Year" value={yearValue.join("-")} onChange={e => setYearValue(e.target.value.replace(" ", "").split("-"))} id="mediumLarge-font"/>
                    </div>
                    <div className="filterOptions-options-country-container">
                        <Form.Label className="country-label" id="mediumLarge-font">Sample country</Form.Label>
                        <Form.Control className="country-input" size="sm" name="Country" value={countryValue} onChange={e => setCountryValue(e.target.value)} id="mediumLarge-font"/>
                    </div>
                    <Button className="filterOptions-options-button" variant="outline-primary" type="submit" id="mediumLarge-font">Apply filters</Button>
                </Form>
            </div>
    )
}