import React from "react"
import Pagination from 'react-bootstrap/Pagination'

import "../CSS/paginateResults.css"

class Paginate extends React.Component {
    constructor() {
      super();
      this.state = {
        currentPage: 1,
      };
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
      this.setState({
        currentPage: Number(event.target.id)
      });
    }

    render() {
      const { currentPage } = this.state;
      const todosPerPage = this.props.resultNumber;
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const renderTodos = this.props.resultsRendered.slice(indexOfFirstTodo, indexOfLastTodo);
      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(this.props.resultsRendered.length / todosPerPage); i++) {
        pageNumbers.push(i);
      };
      const renderPageNumbers = pageNumbers.map(number => {
          if(currentPage === 1 && (number === 1 | number == 2 | number == 3)) {
            return (
              <Pagination.Item key={number} id={number} active={number === currentPage} onClick={this.handleClick}>
                  {number}
              </Pagination.Item >
          )};
          if(currentPage !== 1 && currentPage !== pageNumbers.length && (number == currentPage - 1 | number == currentPage | number == currentPage + 1)) {
            return (
              <Pagination.Item key={number} id={number} active={number === currentPage} onClick={this.handleClick}>
                  {number}
              </Pagination.Item >
          )}
          if(currentPage === pageNumbers.length && (number === pageNumbers.length | number == pageNumbers.length - 1 | number == pageNumbers.length - 2)) {
            return (
              <Pagination.Item key={number} id={number} active={number === currentPage} onClick={this.handleClick}>
                  {number}
              </Pagination.Item >
          )}});

      function divideGenes(gene_list) {
          return (
            <>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(0, 10)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(10, 20)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(20, 30)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(30, 40)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(40, 50)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(50, 60)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(60, 70)}
            </div>
            <div className="searchResult-genesContained-column">
              {gene_list.slice(70, 80)}
            </div>
            </>
        )};

    //conditional CSS
    const searchResult_container = (this.props.queryType === "genesContained") ? "searchResult-container-compressed" : "searchResult-container";
    const searchResult_items = (this.props.queryType === "genesContained" |  this.props.queryType === "sequencesContained") ? "searchResult-items-compressed" : "searchResult-items";
      return (
        <div className={searchResult_container}>
          <div className="searchResult-box">
            <div className="searchResult-bar">
                {(this.props.queryType === "sequence") &&
                <div>
                    <div className="searchResult-bar-genetext">
                        Gene Name
                    </div>
                    <div className="searchResult-bar-matchproportion">
                        Match proportion
                    </div>
                </div>}
                {(this.props.queryType === "paper") &&
                    <div className="searchResult-bar-paper">
                        Paper title
                    </div>}
                {(this.props.queryType === "isolate" | this.props.queryType == 'isolatesContained') &&
                  <>
                    <div className="searchResult-bar-isolatebiosampletext">
                      Biosample accession
                    </div>
                    <div className="searchResult-bar-isolatespeciestext">
                      Species
                    </div>
                    <div className="searchResult-bar-isolaterepresentation">
                      Genome representation
                    </div>
                    <div className="searchResult-bar-isolatecontigstext">
                      Number of contigs
                    </div>
                    <div className="searchResult-bar-isolatesequencelinktext">
                      Download links
                    </div>
                  </>}
                  {(this.props.queryType === "speciesContained") &&
                  <>
                    <div className="searchResult-bar-allisolatesbiosample">
                      Biosample accession
                    </div>
                  </>}
                {(this.props.queryType === "genesContained") &&
                    <div className="searchResult-bar-genesContained">
                        Identified genes
                    </div>}
                {(this.props.queryType === "sequencesContained") &&
                <>
                    <div className="searchResult-bar-isolatetext">
                        Isolate
                    </div>
                    <div className="searchResult-bar-sequencetext">
                        Sequence
                    </div>
                </>}
                {(this.props.queryType === "genusContained") &&
                  <div className="searchResult-bar-genustext">Species found
                </div>}
            </div>
            {(this.props.queryType !== "genesContained") && <div className={searchResult_items}>
                {renderTodos}
            </div>}
            {(this.props.queryType === "genesContained") && <div className={searchResult_items}>
              <div className="searchResult-items-columned">
                {divideGenes(renderTodos)}
              </div>
            </div>}
          </div>
          <Pagination className="pagination-navigation" size="sm">
            <Pagination.First onClick={() => this.setState({currentPage: 1})}/>
              {renderPageNumbers}
            <Pagination.Last onClick={() => this.setState({currentPage: pageNumbers.length})}/>
          </Pagination>
        </div>
      );
    }
  }

export default Paginate;