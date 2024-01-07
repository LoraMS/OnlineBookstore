import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import validator from 'validator';
import Input from './../common/Input.jsx';
import './Login.css';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      confirm: '',
      message: '',
      errors:{},
      submitting: false,
    };
  }

  validate = (username, email, password) => {
    let errors = {};
    let formIsValid = true;
  
    if (!validator.isEmail(email)) {
      formIsValid = true;
      errors["email"] = 'Please provide a correct email address.';
    }
  
    if (password.trim().length < 4) {
      formIsValid = true;
      errors["password"] = 'Password must have at least 4 characters.';
    }
  
    if (username.trim().length === 0) {
      formIsValid = true;
      errors["username"] = 'Please provide your name.';
    }

    if (password !== this.state.confirm) {
      formIsValid = true;
      errors["confirm"] = 'Register failed.Passwords do not match';
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

    const { username, email, password } = this.state;

    this.setState({submitting: true});  

    if (!this.validate(username, email, password)) {
      this.setState({submitting: false})
      toastr.error('Check the form for errors.');
      return;
    }
    this.setState({errors: {}});

    axios.post('/api/auth/register', { username, email, password })
      .then((result) => {
        this.setState({ 
          message: '', 
          submitting: false 
        });
        toastr.success('Register successful!');
        this.props.history.push("/login")
      })
      .catch((error) => {
        if(error.response.status === 401) {
          toastr.error('Register failed!Check the form for errors!');
          this.setState({ message: error.response.data.message });
          this.setState({submitting: false});
        }
      });
  }

  render() {
    const { username, email, password, confirm, message, errors } = this.state;
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
        {message !== '' &&
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Error</strong> {message}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }
          <h2 className="form-signin-heading">Please Register</h2>
          <Input
            name="username"
            type="text"
            value={username}
            placeholder="Username"
            onChange={this.onChange}
            label="Username" />
            <small className="error mb-2">{errors["username"]}</small>
          <Input
            name="email"
            type="email"
            value={email}
            placeholder="Email address"
            onChange={this.onChange}
            label="Email address" />
            <small className="error mb-2">{errors["email"]}</small>
          <Input
            name="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={this.onChange}
            label="Password" />
            <small className="error mb-2">{errors["password"]}</small>
          <Input
            name="confirm"
            type="password"
            value={confirm}
            placeholder="Confirm Password"
            onChange={this.onChange}
            label="Confirm Password" />
            <small className="error mb-2">{errors["confirm"]}</small>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;