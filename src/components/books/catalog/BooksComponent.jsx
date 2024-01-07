import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class BooksComponent extends Component {
    render() {
        const token = localStorage.getItem('jwtToken');
        return (
            this.props.books.map(book =>
                <div className="col-md-3" key={book._id}>
                    <div className="card mb-3 bg-light">
                        <Link to={`/book/${book._id}`}>
                          <img className="card-img-top" src={book.imageURL} alt="book" data-holder-rendered="true"/>
                        </Link>
                          <div className="card-body">
                            <Link to={`/book/${book._id}`}>
                              <h5 className="card-title text-muted"><u>{book.title}</u></h5>
                            </Link>
                            <p className="card-text">{book.shortDescription}</p>
                            <p className="price">
                            {new Intl.NumberFormat('de-DE', { 
                                style: 'currency', 
                                currency: 'USD' 
                            }).format(book.price)}
                            </p>
                            <Link to={`/book/${book._id}`} type="button" className="btn btn-sm btn-secondary mr-2">View More</Link>
                            {token !== null && this.props.buttonCart && <button type="button" className="btn btn-sm btn-secondary" 
                            onClick={this.props.addToCart.bind(this, book.imageURL, book.title, book.price, book._id)}>
                            Add to Cart
                            </button>}
                        </div>
                    </div>
                </div>
            )
        );
      }
}