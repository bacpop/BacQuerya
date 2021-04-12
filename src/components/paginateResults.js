import React from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

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
      const todosPerPage = this.props.resultNumber
      const indexOfLastTodo = currentPage * todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
      const renderTodos = this.props.resultsRendered.slice(indexOfFirstTodo, indexOfLastTodo);
      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(this.props.resultsRendered.length / todosPerPage); i++) {
        pageNumbers.push(i);
      }
      const renderPageNumbers = pageNumbers.map(number => {
          return (
            <Nav.Link
            key={number}
            id={number}
            onClick={this.handleClick}
          >
            {number}
          </Nav.Link>
        )})
      return (
        <div className="searchResult-container">
          <div className="searchResult-box">
            <>
            <div className="searchResult-bar">
                {(this.props.queryType === "sequence") &&
                <>
                    <div className="searchResult-bar-genetext">
                        Gene Name
                    </div>
                    <div className="searchResult-bar-matchproportion">
                        Match proportion
                    </div>
                </>}
                {(this.props.queryType === "paper") &&
                    <div className="searchResult-bar-paper">
                        Paper title
                    </div>}
                {(this.props.queryType === "isolate") &&
                    <div className="searchResult-bar-isolate">
                        Biosample accession
                    </div>}
                {(this.props.queryType === "genesContained") &&
                    <div className="searchResult-bar-genesContained">
                        Genes contained
                    </div>}
            </div>
            <div className="searchResult-items">
                {renderTodos}
            </div>
            </>
          </div>
          <Navbar className="custom-navbar">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        {renderPageNumbers}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
      );
    }
  }

export default Paginate;