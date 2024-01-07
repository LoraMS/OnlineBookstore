import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

export default class Profile extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: {}
          };
    }

    componentDidMount () {
        const name = localStorage.getItem('name');
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/auth/all/' + name)
        .then(res => {
            this.setState({ user: res.data });
        })
        .catch((error) => {
            if(error.response.status === 401) {
              this.props.history.push('/login');
            }
        });
     }

    render() {
        // const imgURL = 'https://drive.google.com/thumbnail?id=11uo_6bgKcjtkZkSJQYj47CTa-_C-hh0P';
        const imgURL = "https://drive.google.com/thumbnail?id=1ko7YsuM3AcLosL_LJe47eBCrRWCQITVW";
        const eList = this.state.user.eventList || [];
        const bList = this.state.user.bookList || [];
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                        <img className="card-img-top profile-img" src={imgURL} alt="profile_img" />
                            <div className="card-body">
                                <h5 className="card-title">User Profile Information</h5>
                                <p className="card-text"><strong>Username: </strong>{this.state.user.username}</p>
                                <p className="card-text"><strong>Email: </strong>{this.state.user.email}</p>
                                <p className="card-text"><strong>My Book List: </strong><span className="badge badge-secondary">{bList.length}</span></p>
                                <p className="card-text"><strong>My Events: </strong><span className="badge badge-secondary">{eList.length}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 offset-md-1">
                       <div className="card card-profile mb-3">
                        <div className="card-header">My Book List</div>
                            <ul className="list-group list-group-flush">
                            {bList.map((b)=>
                            <li key={b._id} className="list-group-item"><Link to={`/book/${b.bookId}`}>{b.title}</Link></li>
                            )}
                            </ul>
                       </div>
                        <div className="card card-profile mt-3">
                            <div className="card-header">My Events</div>
                            <ul className="list-group list-group-flush">
                            {eList.map((ev)=>
                            <li key={ev._id} className="list-group-item"><Link to={`/event/${ev.eventId}`}>{ev.title}</Link></li>
                            )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

