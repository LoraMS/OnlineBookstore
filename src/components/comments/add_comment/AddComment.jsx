import React, { Component } from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import toastr from 'toastr';
import './AddComment.css';

class AddComment extends Component{
    constructor(props){
        super(props);

        this.state = {
            author: '',
            content: '',
            message: '',
        };
    }

    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        this.setState({
            author: localStorage.getItem('name'),
        });
    }

    onChange(e){
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e){
        e.preventDefault();
        const {author, content} = this.state;

        if (content.trim().length < 2) {
            this.setState({ message: 'Comment must be more than 2 symbols.' });
            return;
        }

        axios.put(`/api/book/${this.props.id}/comments` , {author, content})
        .then((result) => {
            toastr.success('Comment is added successfully!');
            this.props.history.go(0);
            // this.forceUpdate();
        })
        .catch((error) => {
            if(error.response.status === 401) {
                toastr.error('Check the form for errors.');
                this.setState({ message: error.response.data.message });
            }
        });
    }

    render(){
        const {author, content} = this.state;
        return(
            <form id="commentForm" onSubmit={this.onSubmit.bind(this)}>
                {this.state.message !== '' &&
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Error</strong> {this.state.message}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                }
                <div className="form-group">
                    <label htmlFor="content" className="sr-only">Review</label>
                    <textarea className="form-control" name="content" placeholder="Review" cols="80" rows="2" value={this.state.content} onChange={this.onChange.bind(this)}></textarea>
                </div>
                <input type="submit"  value="Add Review" className="btn btn-sm btn-secondary review-btn" />
            </form>
        );
    }
}
export default withRouter(AddComment);
// onClick={this.props.update({author, content})}