import React from 'react';

const NonEmptyCart = (props) => {
    return (
        <div>
            {props.cart.map(book =>
                <div className="cart-item" key={book.id}>
                    <img className="book-image" src={book.image} alt="book" />
                    <div className="book-info">
                        <p className="book-title">{book.title}</p>
                    </div>
                    <div className="book-total">
                        <p className="amount">{book.price}</p>
                    </div>
                    <button type="button" className="book-remove close" aria-label="Close" onClick={props.removeBook.bind(this, book.id)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>
    )
};

export default NonEmptyCart;