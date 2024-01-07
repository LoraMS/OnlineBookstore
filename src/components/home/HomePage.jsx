import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <div className="slider">
        <img src={require('./slider-books.jpg')} alt="cover_img" />
        <div className="centered title">Inspire Daily Reading</div>
        <p className="centered subtitle">Visit Our Page and Discover Your Next Book</p>
      </div>
      <main role="main">
        <div className="container marketing">
          <div className="row">
            <div className="col-lg-4 text-center">
              <img className="rounded-circle" src={require('./store.jpg')} width="140" height="140" alt="prod1" />
              <h2>Books</h2>
              <p className="text-justify">Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
              <p><Link to="/catalog" className="btn btn-secondary">View books »</Link></p>
            </div>
            <div className="col-lg-4 text-center">
              <img className="rounded-circle" src={require('./event.jpg')} width="140" height="140" alt="prod2" />
              <h2>Events</h2>
              <p className="text-justify">Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.</p>
              <p><Link to="/events" className="btn btn-secondary">View events »</Link></p>
            </div>
            <div className="col-lg-4 text-center">
              <img className="rounded-circle" src={require('./g-map.jpg')} width="140" height="140" alt="prod3" />
              <h2>Contact Us</h2>
              <p className="text-justify">Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.</p>
              <p><Link to="/about" className="btn btn-secondary">View details »</Link></p>
            </div>
          </div>
          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading">Lorem ipsum dolor sit amet. <span className="text-muted">Consectetur adipiscing elit.</span></h2>
              <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
            <div className="col-md-5">
              <img className="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" src={require('./store.jpg')} data-holder-rendered="true" />
            </div>
          </div>
          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7 order-md-2">
              <h2 className="featurette-heading">Osed do eiusmod tempor.<span className="text-muted">Sincididunt ut labore.</span></h2>
              <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
            <div className="col-md-5 order-md-1">
              <img className="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" src={require('./event.jpg')} data-holder-rendered="true" />
            </div>
          </div>
          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading">Consectetur adipiscing.<span className="text-muted">Cet dolore magna aliqua.</span></h2>
              <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
            <div className="col-md-5">
              <img className="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" src={require('./g-map.jpg')} data-holder-rendered="true" />
            </div>
          </div>
          <hr className="featurette-divider" />
        </div>
      </main>
    </div>
  );
}

export default Home;