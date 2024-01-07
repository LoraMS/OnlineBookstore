import React from 'react';
import { Link } from 'react-router-dom'; 

const PageNotFound = () => (
    <div className="container">
        <img src={require('./not-found.jpg')} alt="not_found"/>
        <div className="text-center">
            <h2>Sorry, no item matched your search!</h2>
            <p>Enter a different keyword and try again.</p>
            <Link to="/" type="button" className="btn btn-sm btn-secondary mt-3">Go to Home Page</Link>
        </div>
    </div>
);

export default PageNotFound;