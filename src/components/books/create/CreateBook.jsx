import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import validator from 'validator';
import Input from './../../common/Input';
import './CreateBook.css';

class CreateBook extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isbn: '',
      title: '',
      author: '',
      shortDescription: '',
      description: '',
      publishedYear: '',
      publisher: '',
      imageURL: '',
      price: 0,
      category: '',
      tags: [],
      reviews: [],
      message: '',
      errors:{},
      submitting: false,
    };
  }

  fileSelectHandler = event => {
    this.setState({
      imageURL: event.target.value
    })
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
  }

  validate = (isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category) => {
    let errors = {};
    let formIsValid = true;

    if (isbn.trim().length < 2) {
      formIsValid = false;
      errors["isbn"] = 'ISBN must be more than 2 symbols.';
    }
  
    if (title.trim().length < 5) {
      formIsValid = false;
      errors["title"] = 'Title must be more than 5 symbols.';
    }
  
    if (author.trim().length < 2) {
      formIsValid = false;
      errors["author"] = 'Author must be more than 2 symbols.';
    }
  
    if (shortDescription.trim().length < 10) {
      formIsValid = false;
      errors["shortDescription"] = 'Description must be more than 10 symbols.';
    }
  
    if (description.trim().length < 100) {
      formIsValid = false;
      errors["description"] = 'Description must be more than 100 symbols.';
    }
  
    if (publisher.trim().length < 2) {
      formIsValid = false;
      errors["publisher"] = 'Publisher must be more than 2 symbols.';
    }
  
    if (category.trim().length < 5) {
      formIsValid = false;
      errors["category"] = 'Category is required and must be more then 5 symbols.';
    }
  
    if (!validator.isURL(imageURL)) {
      formIsValid = false;
      errors["imageURL"] = 'Image URL is not correct.';
    }
  
    if (price < 0) {
      formIsValid = false;
      errors["price"] = 'Price must be a positive number between 1 and 100.';
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
    const { isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category } = this.state; 

    this.setState({submitting: true});  

    if (!this.validate(isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category)) {
      this.setState({submitting: false})
      toastr.error('Check the form for errors.');
      return;
    }
    this.setState({errors: {}})

    axios.post('/api/book', { isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category})
      .then((result) => {
        toastr.success('Book added successfully!');
        this.setState({ submitting: false });
        this.props.history.push("/catalog");
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
    const { isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category, message, errors } = this.state;
    return (
      <div className="container">
        <div className="panel">
        <h2 className="create-title">
              Add Book
            </h2>
            <form onSubmit={this.onSubmit.bind(this)}>
            {message !== '' &&
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Error</strong> {message}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }
              <div className="form-group">
                <Input
                  name="isbn"
                  type="text"
                  value={isbn}
                  placeholder=" ISBN"
                  onChange={this.onChange.bind(this)}
                  label="ISBN" />
              </div>
              <small className="error mb-2">{errors["isbn"]}</small>
              <div className="form-group">
                <Input
                  name="title"
                  type="text"
                  value={title}
                  placeholder=" Title"
                  onChange={this.onChange.bind(this)}
                  label="Title" />
              </div>
              <small className="error mb-2">{errors["title"]}</small>
              <div className="form-group">
              <Input
                  name="author"
                  type="text"
                  value={author}
                  placeholder=" Author"
                  onChange={this.onChange.bind(this)}
                  label="Author" />
              </div>
              <small className="error mb-2">{errors["author"]}</small>
              <div className="form-group">
                <label htmlFor="short_description" className="sr-only">Short Description:</label>
                <textarea className="form-control" name="shortDescription" onChange={this.onChange.bind(this)} placeholder="Short Description" cols="80" rows="2" value={shortDescription} />
              </div>
              <small className="error mb-2">{errors["shortDescription"]}</small>
              <div className="form-group">
                <label htmlFor="description" className="sr-only">Description:</label>
                <textarea className="form-control" name="description" onChange={this.onChange.bind(this)} placeholder="Description" cols="80" rows="3" value={description} />
              </div>
              <small className="error mb-2">{errors["description"]}</small>
              <div className="form-group">
                <Input
                  name="publishedYear"
                  type="number"
                  value={publishedYear}
                  placeholder=" Published Year"
                  onChange={this.onChange.bind(this)}
                  label="Published Date" />
              </div>
              <small className="error mb-2">{errors["publishedYear"]}</small>
              <div className="form-group">
                <Input
                  name="publisher"
                  type="text"
                  value={publisher}
                  placeholder=" Publisher"
                  onChange={this.onChange.bind(this)}
                  label="Publisher" />
              </div>
              <small className="error mb-2">{errors["publisher"]}</small>
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
                  name="price"
                  type="number"
                  value={price}
                  placeholder=" Price"
                  onChange={this.onChange.bind(this)}
                  label="Price" />
              </div>
              <small className="error mb-2">{errors["price"]}</small>
              <div className="form-group">
                  <Input
                  name="imageURL"
                  type="text"
                  value={imageURL}
                  placeholder=" Image URL"
                  onChange={(e) => { this.onChange(e); this.fileSelectHandler(e) } }
                  label="Image" />
                <img src={this.state.imageURL} alt="img" />
              </div>
              <small className="error mb-2">{errors["imageURL"]}</small>
              <button type="submit" className="btn btn-secondary" disabled={this.state.submitting}>Add Book</button>
            </form>
        </div>
      </div>
    );
  }
}

export default CreateBook;