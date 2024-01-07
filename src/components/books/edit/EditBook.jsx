import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import validator from 'validator';
import { Link } from 'react-router-dom';
import Input from './../../common/Input';
import './EditBook.css';

class EditBook extends Component {

  constructor(props) {
    super(props);
    this.state = {
      book: {},
      message: '',
      errors:{},
      submitting: false,
    };
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('/api/book/'+this.props.match.params.id)
      .then(res => {
        this.setState({ book: res.data });
      });
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
    const state = this.state.book
    state[e.target.name] = e.target.value;
    this.setState({book:state});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category } = this.state.book;

    this.setState({submitting: true});  

    if (!this.validate(isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category)) {
      this.setState({submitting: false})
      toastr.error('Check the form for errors.');
      return;
    }
    this.setState({errors: {}})

    axios.put('/api/book/'+this.props.match.params.id, { isbn, title, author, shortDescription, description, publishedYear, publisher, imageURL, price, category })
      .then((result) => {
        toastr.success('Book edit successfully!');
        this.setState({ submitting: false });
        this.props.history.push("/book/"+this.props.match.params.id)
      })
      .catch((error) => {
        if(error.response.status === 401) {
          toastr.error('Edit failed. Check the form for errors.');
          this.setState({ submitting: false });
          this.setState({ message: error.response.data.message });
        }
      });
  }

  render() {
    return (
      <div className="container">
        <div className="panel">
            <h2 className="edit-title">
              Edit Book
            </h2>
            <form onSubmit={this.onSubmit.bind(this)}>
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
                  name="isbn"
                  type="text"
                  value={this.state.book.isbn}
                  placeholder=" ISBN"
                  onChange={this.onChange.bind(this)}
                  label="ISBN" />
              </div>
              <small className="error mb-2">{this.state.errors["isbn"]}</small>
              <div className="form-group">
                <Input
                  name="title"
                  type="text"
                  value={this.state.book.title}
                  placeholder=" Title"
                  onChange={this.onChange.bind(this)}
                  label="Title" />
              </div>
              <small className="error mb-2">{this.state.errors["title"]}</small>
              <div className="form-group">
                <Input
                  name="author"
                  type="text"
                  value={this.state.book.author}
                  placeholder=" Author"
                  onChange={this.onChange.bind(this)}
                  label="Author" />
              </div>
              <small className="error mb-2">{this.state.errors["author"]}</small>
              <div className="form-group">
                <label for="short_description" className="sr-only">Short Description:</label>
                <textArea className="form-control" name="shortDescription" onChange={this.onChange.bind(this)} placeholder="Short Description" cols="80" rows="2">{this.state.book.shortDescription}</textArea>
              </div>
              <small className="error mb-2">{this.state.errors["shortDescription"]}</small>
              <div className="form-group">
                <label for="description" className="sr-only">Description:</label>
                <textArea className="form-control" name="description" onChange={this.onChange.bind(this)} placeholder="Description" cols="80" rows="3">{this.state.book.description}</textArea>
              </div>
              <small className="error mb-2">{this.state.errors["description"]}</small>
              <div className="form-group">
                <Input
                  name="publishedYear"
                  type="number"
                  value={this.state.book.publishedYear}
                  placeholder=" Published Year"
                  onChange={this.onChange.bind(this)}
                  label="Published Date" />
              </div>
              <small className="error mb-2">{this.state.errors["publishedYear"]}</small>
              <div className="form-group">
                <Input
                  name="publisher"
                  type="text"
                  value={this.state.book.publisher}
                  placeholder=" Publisher"
                  onChange={this.onChange.bind(this)}
                  label="Publisher" />
              </div>
              <small className="error mb-2">{this.state.errors["publisher"]}</small>
              <div className="form-group">
                <Input
                  name="category"
                  type="text"
                  value={this.state.book.category}
                  placeholder=" Category"
                  onChange={this.onChange.bind(this)}
                  label="Category" />
              </div>
              <small className="error mb-2">{this.state.errors["category"]}</small>
              <div className="form-group">
                <Input
                  name="price"
                  type="number"
                  value={this.state.book.price}
                  placeholder=" Price"
                  onChange={this.onChange.bind(this)}
                  label="Price" />
              </div>
              <small className="error mb-2">{this.state.errors["price"]}</small>
              <div className="form-group">
                  <Input
                  name="imageURL"
                  type="text"
                  value={this.state.book.imageURL}
                  placeholder=" Image URL"
                  onChange={this.onChange.bind(this)}
                  label="Image" />
                <img src={this.state.book.imageURL} alt="img" />
              </div>
              <small className="error mb-2">{this.state.errors["imageURL"]}</small>
              <Link to={`/book/${this.state.book._id}`} className="btn btn-secondary mr-3">Back to Book</Link>
              <button type="submit" className="btn btn-secondary">Edit Book</button>
            </form>
        </div>
      </div>
    );
  }
}

export default EditBook;