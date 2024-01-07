import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import BooksComponent from './../books/catalog/BooksComponent';
import './../books/catalog/Catalog.css';

export default class CategoryBook extends Component {
    constructor(props){
        super(props);
        this.state= {
            books: [],
            buttonCart: false
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/book/category/' + this.props.match.params.name)
          .then(res => {
            this.setState({ books: res.data });
          })
          .catch((error) => {
            if(error.response.status === 401) {
              toastr.error('Unauthorized. Please Login!');
              this.props.history.push("/catalog");
            }
          });
      }

      render() {
        return (
          <div className="container">
            <div className="panel">
              <div>
                <h2 className="page-title">
                  Books in Category {this.props.match.params.name}
                </h2>
              </div>
              <div className="album py-5">
                <div className="container">
                  <div className="row">
                  <BooksComponent books={this.state.books} buttonCart={this.state.buttonCart}/>
                </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
}