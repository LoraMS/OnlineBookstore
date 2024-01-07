import React, { Component } from 'react';
import axios from 'axios';
import './Profile.css';

export default class UserList extends Component {
    constructor(props){
        super(props);
        this.state= {
            users: []
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/auth/all')
          .then(res => {
            this.setState({ users: res.data });
          })
          .catch((error) => {
            if(error.response.status === 401) {
              this.props.history.push("/login");
            }
          });
      }

      delete(id){
        axios.delete('/api/auth/all/'+id)
          .then((result) => {
            this.props.history.push("/profile")
          });
      }

    render() {
        const imgURL = 'https://drive.google.com/thumbnail?id=11uo_6bgKcjtkZkSJQYj47CTa-_C-hh0P';
        return (
            <div className="container">
               <div id="users">
               <table className="table">
                   <thead>
                       <tr>
                           <th>Avatar Image</th>
                           <th>Username</th>
                           <th>Email</th>
                           <th>Role</th>
                           <th>Delete</th>
                       </tr>
                   </thead>
                   <tbody>
                   {this.state.users.map(user =>
                       <tr key={user._id}>
                           <td><img src={imgURL} className="profile-img-list" alt="profile_img"/></td>
                           <td>{user.username}</td>
                           <td>{user.email}</td>
                           <td>{user.role}</td>
                           <td><button onClick={this.delete.bind(this, user._id)} className="btn btn-sm btn-secondary mr-1">Delete</button></td>
                       </tr>
                       )}
                   </tbody>
                </table>  
                </div>
           </div>
        );
    }
}
