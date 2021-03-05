import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import IsolateQuery from './indexQuerying/isolateQuery'
import PaperQuery from './indexQuerying/paperQuery'
import GeneQuery from './indexQuerying/geneQuery'
import AssemblyQuery from './indexQuerying/assemblyQuery'

function SearchPage() {

    const [formData, updateFormData] = useState(null);
    const [queryType, setQueryType] = useState(null);
    const [search, setSearch] = useState(false);

    const getTerm = (e) => {
        setSearch(false);
        updateFormData(e.target.value);
    };

    const getType = (e) => {
        setSearch(false);
        setQueryType(e.target.value);
    };

    const loadResult = () => {
        setSearch(true);
    }

    return(
        <div>
            <>
            <Form inline className="mb-3">
            <FormControl
                name="searchTerm"
                placeholder="Search term"
                aria-label="Search term"
                aria-describedby="basic-addon2"
                onChange={getTerm}/>
            <FormControl
                as="select"
                className="my-1 mr-sm-2"
                id="type"
                custom
                onChange={getType}>
                <option value='0'>choose...</option>
                <option value="isolate">isolate</option>
                <option value="paper">paper</option>
                <option value="sequence">sequence</option>
                <option value="assembly">assembly</option>
            </FormControl>
                <Button onClick={loadResult} variant="outline-primary">Search</Button>
            </Form>
            <div>
            { (search===true && queryType==="isolate") && <IsolateQuery searchTerm={formData}/> }
            { (search===true && queryType==="paper") && <PaperQuery searchTerm={formData}/> }
            { (search===true && queryType==="sequence") && <GeneQuery searchTerm={formData}/> }
            { (queryType==="assembly") && <AssemblyQuery searchTerm={formData} postAssembly={search}/> }
            </div>
            </>
        </div>
    );
};

export default SearchPage;