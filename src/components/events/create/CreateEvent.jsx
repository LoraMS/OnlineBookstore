import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import validator from 'validator';
import Input from './../../common/Input';

class CreateEvent extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      eventDate: '',
      hours: '',
      imageURL: '',
      category: '',
      users: [],
      message: '',
      errors:{},
      submitting: false,
    };
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
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
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { title, description, eventDate, hours, imageURL, category } = this.state;
    this.setState({submitting: true});  

    if (!this.validate(title, description, eventDate, hours, imageURL, category)) {
      this.setState({submitting: false})
      toastr.error('Check the form for errors.');
      return;
    }
    this.setState({errors: {}});
    
    axios.post('/api/event', { title, description, eventDate, hours, imageURL, category })
      .then((result) => {
        toastr.success('Event added successfully!');
        this.setState({ submitting: false });
        this.props.history.push("/events")
    })
    .catch((error) => {
      if(error.response.status === 401) {
        toastr.error('Create failed. Check the form for errors.');
        this.setState({submitting: false});  
        this.setState({ message: error.response.data.message });
      }
    });
  }

  render() {
    const { title, description, eventDate, hours, imageURL, category, message, errors } = this.state;
    return (
      <div className="container">
        <div className="panel">
        <h2 className="create-title">
              Add Event
            </h2>
            <form onSubmit={this.onSubmit.bind(this)}>
            {message !== '' &&
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Error</strong> {message}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>}
              <div className="form-group">
                <Input
                  name="title"
                  type="text"
                  value={title}
                  placeholder=" Title"
                  onChange={this.onChange.bind(this)}
                  label="Title" />
              </div>
              <small className="error mb-2">{errors["title"]}</small >
              <div className="form-group">
                <label htmlFor="description" className="sr-only">Description:</label>
                <textarea className="form-control" name="description" onChange={this.onChange} placeholder="Description" cols="80" rows="3" value={description} />
              </div>
              <small className="error mb-2">{errors["description"]}</small>
              <div className="form-group">
                <Input
                  name="eventDate"
                  type="date"
                  value={eventDate}
                  placeholder=" Event Date"
                  onChange={this.onChange.bind(this)}
                  label="Event Date" />
              </div>
              <small className="error mb-2">{errors["eventDate"]}</small>
              <div className="form-group">
                <Input
                  name="hours"
                  type="text"
                  value={hours}
                  placeholder=" Hours"
                  onChange={this.onChange.bind(this)}
                  label="Hours" />
              </div>
              <small className="error mb-2">{errors["hours"]}</small>
              <div className="form-group">
                <Input
                  name="category"
                  type="text"
                  value={category}
                  placeholder=" Category"
                  onChange={this.onChange.bind(this)}
                  label="Category" />
              </div>
              <small className="error mb-2">{errors["category"]}</small>
              <div className="form-group">
                  <Input
                  name="imageURL"
                  type="text"
                  value={imageURL}
                  placeholder=" Image URL"
                  onChange={this.onChange.bind(this)}
                  label="Image" />
                  <img src={this.state.imageURL} alt="img" />
              </div>
              <small className="error mb-2">{errors["imageURL"]}</small>
              <button type="submit" className="btn btn-secondary" disabled={this.state.submitting}>Add Event</button>
            </form>
        </div>
      </div>
    );
  }
}

export default CreateEvent;