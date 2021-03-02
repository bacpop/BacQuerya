import React from 'react';

class UploadAssembly extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        assemblyURL: '',
    };
    this.handleUploadAssembly = this.handleUploadAssembly.bind(this);
    }

    handleUploadAssembly(e) {
        e.preventDefault();
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        fetch('http://localhost:5000/assembly', {
            method: 'POST',
            body: data,
            }).then((response) => {
                response.json().then((body) => {
                this.setState({ assemblyURL: `http://localhost:8000/${body.file}` });
                });
            });
    };

    render() {
        return (
            <form onSubmit={this.handleUploadAssembly}>
            <div>
                <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
            </div>
            <div>
                <button>Upload</button>
            </div>
            </form>
        );
    };
};

export default UploadAssembly;