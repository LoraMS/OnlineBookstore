import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import validator from 'validator';
import { Link } from 'react-router-dom';
import Input from './../../common/Input';


class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      message: '',
      errors:{},
      submitting: false,
    };
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('/api/event/'+this.props.match.params.id)
      .then(res => {
        this.setState({ event: res.data });
      });
  }

  validate = (title, description, eventDate, hours, imageURL, category) => {
    let errors = {};
    let formIsValid = true;

    if (title.trim().length < 5) {
      formIsValid = false;
      errors["title"] = 'Title must be more than 5 symbols.';
    }

    if (description.trim().length < 100) {
      formIsValid = false;
      errors["description"] = 'Description must be more than 100 symbols.';
    }

    if (validator.isBefore(eventDate)) { 
      formIsValid = false;
      errors["eventDate"] = 'Date is not correct.';
    }

    if (!hours.match(/^[1-8]+$/)) {
      formIsValid = false;
      errors["hours"] = 'Hour must be number between 1 and 8.';
    }

    if (category.trim().length < 5) {
      formIsValid = false;
      errors["category"] = 'Category is required and must be more then 5 symbols.';
    }

    if (!validator.isURL(imageURL)) {
      formIsValid = false;
      errors["imageURL"] = 'Image URL is not correct.';
    }

    this.setState({errors: errors})
    
    return formIsValid;
  }

  onChange = (e) => {
    const state = this.state.event
    state[e.target.name] = e.target.value;
    this.setState({event:state});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { title, description, eventDate, hours, imageURL, category } = this.state.event;
    this.setState({submitting: true});  

    if (!this.validate(title, description, eventDate, hours, imageURL, category)) {
      this.setState({submitting: false})
      toastr.error('Check the form for errors.');
      return;
    }
    this.setState({errors: {}});

    axios.put('/api/event/'+this.props.match.params.id, { title, description, eventDate, hours, imageURL, category })
      .then((result) => {
        toastr.success('Event edit successfully!');
        this.setState({ submitting: false });
        this.props.history.push("/event/"+this.props.match.params.id);
      })
      .catch((error) => {
        if(error.response.status === 401) {
          toastr.error('Edit failed. Check the form for errors.');
          this.setState({submitting: false}); 
          this.setState({ message: error.response.data.message });
        }
      });
  }

  render() {
    return (
      <div className="container">
        <div className="panel">
            <h2 className="edit-title">
              Edit Event
            </h2>
            <form onSubmit={this.onSubmit}>
            {this.state.message !== '' &&
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Error</strong> {this.state.message}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }
              <div className="form-group">
              <Input
                  name="title"
                  type="text"
                  value={this.state.event.title}
                  placeholder=" Title"
                  onChange={this.onChange}
                  label="Title" />
              </div>
              <small className="error mb-2">{this.state.errors["title"]}</small >
              <div className="form-group">
                <label htmlFor="description" className="sr-only">Description:</label>
                <textArea className="form-control" name="description" onChange={this.onChange} placeholder="Description" cols="80" rows="3">{this.state.event.description}</textArea>
              </div>
              <small className="error mb-2">{this.state.errors["description"]}</small>
              <div className="form-group">
              <Input
                  name="eventDate"
                  type="text"
                  value={this.state.event.eventDate}
                  placeholder=" Event Date"
                  onChange={this.onChange}
                  label="Event Date" />
              </div>
              <small className="error mb-2">{this.state.errors["eventDate"]}</small>
              <div className="form-group">
              <Input
                  name="hours"
                  type="text"
                  value={this.state.event.hours}
                  placeholder=" Hours"
                  onChange={this.onChange}
                  label="Hours" />
              </div>
              <small className="error mb-2">{this.state.errors["hours"]}</small>
              <div className="form-group">
                <Input
                  name="category"
                  type="text"
                  value={this.state.event.category}
                  placeholder=" Category"
                  onChange={this.onChange}
                  label="Category" />
              </div>
              <small className="error mb-2">{this.state.errors["category"]}</small>
              <div className="form-group">
                  <Input
                  name="imageURL"
                  type="text"
                  value={this.state.event.imageURL}
                  placeholder=" Image URL"
                  onChange={this.onChange}
                  label="Image" />
                <img src={this.state.event.imageURL} alt="img" />
              </div>
              <small className="error mb-2">{this.state.errors["imageURL"]}</small>
              <Link to={`/event/${this.state.event._id}`} className="btn btn-secondary mr-3">Back to Event</Link>
              <button type="submit" className="btn btn-secondary">Edit Event</button>
            </form>
        </div>
      </div>
    );
  }
}

export default EditEvent;