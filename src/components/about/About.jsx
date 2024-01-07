import React from 'react';
import './About.css';

const About = (props) => {
    return (
        <div className="container">
            <div>
                <h2 className="about-title">About Us</h2>
                <p className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div>
                        <h4>Address</h4>
                        <p>1423 Broadway</p>
                        <p>Oakland, CA 94612</p>
                    </div>
                    <div>
                        <h4>Contact Us</h4>
                        <dl>
                            <dt>Manager: </dt>
                            <dd>Peter Smith</dd>
                            <dt>Phone: </dt>
                            <dd>510-452-8140</dd>
                            <dt>Fax: </dt>
                            <dd>510-452-7629</dd>
                            <dt>Email: </dt>
                            <dd>bookstore@gmail.com</dd>
                        </dl>
                    </div>
                    <div>
                        <h4>Bookstore Hours</h4>
                        <dl>
                            <dt>Monday: </dt>
                            <dd>8:30AM - 6:00PM</dd>
                            <dt>Tuesday: </dt>
                            <dd>8:30AM - 6:00PM</dd>
                            <dt>Wednesday: </dt>
                            <dd>8:30AM - 6:00PM</dd>
                            <dt>Thursday: </dt>
                            <dd>8:30AM - 6:00PM</dd>
                            <dt>Friday: </dt>
                            <dd>8:30AM - 6:00PM</dd>
                            <dt>Saturday: </dt>
                            <dd>CLOSED</dd>
                            <dt>Sunday: </dt>
                            <dd>CLOSED</dd>
                        </dl>
                    </div>
                </div>
                <div className="col-md-8 map">
                    <div className="embed-responsive embed-responsive-4by3 embed-location">
                        <iframe width="600" height="450" frameborder="0" title="map"
                            src="https://www.google.com/maps/embed/v1/place?q=1423+Broadway,+Oakland,+CA+94612&key=AIzaSyA30gTZgdEDO-4X0Y-nroAlnxJlf0aZlJs" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;