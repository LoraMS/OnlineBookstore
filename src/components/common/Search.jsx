import React, { Component } from 'react';

class Search extends Component {
    handleSubmit(e){
        e.preventDefault();
    }

    render() {
        return(
            <div className="search">
                <form className="form-inline mt-2 mt-md-0">
                    <input 
                    className="form-control mr-sm-2" 
                    type="search" 
                    placeholder="Search for ..." 
                    aria-label="Search"
                    onChange={this.props.search} />
                    <button className="btn btn-sm btn-secondary my-2 my-sm-0" type="submit" onClick={this.handleSubmit.bind(this)}>Search</button>
                </form>
            </div>
        );
    }
}

export default Search;

