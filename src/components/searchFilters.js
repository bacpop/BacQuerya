import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import "../CSS/searchFilters.css"

function filterResults(searchResults, queryType, filters) {

}


export function FilterComponent(props) {

    function getFilters(e) {
        e.preventDefault()
        props.setSelectedFilters({assemblies: e.target.assemblies.checked, reads: e.target.reads.checked})
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
                    <Button className="filterOptions-options-button" variant="outline-primary" type="submit">Apply filters</Button>
                </Form>
            </div>
    )
}