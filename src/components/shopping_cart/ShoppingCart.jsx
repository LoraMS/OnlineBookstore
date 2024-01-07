import React, { Component } from 'react';
import EmptyCart from './EmptyCart';
import NonEmptyCart from './NonEmptyCart';
import './ShoppingCart.css';

export default class ShoppingCart extends Component{
    constructor(props){
        super(props);

        this.state = {
            showCart: false,
        };
     }

    handleCart(e){
        e.preventDefault();
        this.setState({
            showCart: !this.state.showCart
        })
    }

    render(){
        let cartItems = this.props.cart;
        let view;
        if(cartItems.length <= 0){
			view = <EmptyCart />
		} else{
            view =  <NonEmptyCart 
                    cart={this.props.cart} 
                    removeBook={this.props.removeBook} />
                }
        return(
            <div className="cart"> 
                        <div className="cart-info">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Items</td>
                                        <td>:</td>
                                        <td><strong>{this.props.totalItems}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                        <td>:</td>
                                        <td><strong>
                                            {new Intl.NumberFormat('de-DE', { 
                                                style: 'currency', 
                                                currency: 'USD' 
                                                }).format(this.props.total)}
                                        </strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button className="cart-icon" onClick={this.handleCart.bind(this)}>
                            <img src="https://drive.google.com/thumbnail?id=1IfEA5dFnBrWdngo7Hy6jslTHIftYg7IR" alt="Cart"/>
                        </button>
                        <div className={this.state.showCart ? "cart-preview active" : "cart-preview"}>
                            {view}
                            <div className="action-block">
                                {this.props.cart.length > 0  && <div className="row mb-3">
                                    <div className="col-md-4"><strong>Total</strong></div>
                                    <div className="col-md-4"><strong>{this.props.totalItems}</strong></div>
                                    <div className="col-md-4"><strong>
                                    {new Intl.NumberFormat('de-DE', { 
                                            style: 'currency', 
                                            currency: 'USD' 
                                            }).format(this.props.total)}
                                    </strong></div>
                                </div>}
                                <button type="button" className={this.props.cart.length > 0 ? "btn btn-lg btn-secondary" : "btn btn-lg btn-secondary disabled"} onClick={this.props.checkout}>Checkout</button>
                            </div>
                        </div>
                    </div>
        );
    }
}