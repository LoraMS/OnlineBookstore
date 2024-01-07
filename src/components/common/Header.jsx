import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ShoppingCart from '../shopping_cart/ShoppingCart';

export default class Header extends Component {
    render(){
        const { loggedIn, isAdmin, onLogout, total, totalItems, cartItems, removeBook, checkout } = this.props;

        return(
            <header>
            <nav className="nav container">
                <Link className="logo nav-link" to="/"><span>The Bookstore</span></Link>
                <NavLink exact to="/" activeClassName="active" className="nav nav-link">Home</NavLink>
                <NavLink to="/catalog" activeClassName="active" className="nav nav-link">Books</NavLink>
                <NavLink to="/events" activeClassName="active" className="nav nav-link">Events</NavLink>
                <NavLink to="/about" activeClassName="active" className="nav nav-link">Contact Us</NavLink>
                {!loggedIn && <NavLink to="/register" activeClassName="active" className="nav nav-link">Register</NavLink>}
                {!loggedIn && <NavLink to="/login" activeClassName="active" className="nav nav-link">Login</NavLink>}
                {loggedIn && <NavLink to="/profile" activeClassName="active" className="nav  nav-link">Profile</NavLink>}
                {isAdmin && <div className="dropdown">
                <button className="btn dropdown-toggle btn-header" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Admin</button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <Link to="/create" className="dropdown-item nav nav-link">Create Book</Link>
                    <Link to="/add" className="dropdown-item nav nav-link">Create Event</Link>
                    <Link to="/list" className="dropdown-item nav nav-link">All Users</Link>
                </div>
                </div>}
                {loggedIn && <a href="javascript:void(0)" onClick={onLogout} className="nav nav-link">Logout</a>}
                {loggedIn && <ShoppingCart total={total} totalItems={totalItems} cart={cartItems} removeBook={removeBook} checkout={checkout}/>}
            </nav>
            </header>
        );
    }
}