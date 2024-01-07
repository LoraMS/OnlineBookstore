import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import toastr from 'toastr';
import './Event.css';

class Event extends Component {
    constructor(props) {
      super(props);
      this.state = {
        event: {},
        participate: '',
      };
    }

    componentDidMount () {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        const name = localStorage.getItem('name');

        axios.get('/api/event/' + this.props.match.params.id)
        .then(res => {
            this.setState({ event: res.data });

            const index = this.state.event.users.findIndex(u => u === name);
            if(index > -1){
              this.setState({ participate: false });
            } else {
            this.setState({ participate: true });
            }
          })
          .catch((error) => {
            if(error.response.status === 401) {
              toastr.error('Unauthorized. Please Login!');
              this.props.history.push("/login");
            }
          });
        // this.findUserByName();
     }

    // findUserByName(){
    //   const name = localStorage.getItem('name');
    //   axios.get('/api/auth/all/' + name)
    //     .then(res => {
    //       const currentUser = res.data;
    //       const index = currentUser.eventList.findIndex(e=> e.eventId === this.props.match.params.id);
    //       if(index > -1){
    //         this.setState({ participate: false });
    //       } else {
    //       this.setState({ participate: true });
    //       }
    //     });
    // }

    delete(id){
      axios.delete('/api/event/'+id)
        .then((result) => {
          toastr.success('Event deleted successfully!');
          this.props.history.push('/events');
        });
      }

    eventAction(eventId, title){
      const name = localStorage.getItem('name');
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      if (!this.state.participate) {
        axios.put('/api/auth/leave', {eventId, name})
        .then((result) => {
          this.setState({
            participate: true
          });
          toastr.success('You leave this event!');
        })
        .catch((error) => {
          if(error.response.status === 401) {
            toastr.error('Please Login!')
            this.props.history.push("/login");
          }
        });
      } else {
        axios.put('/api/auth/participate', {eventId, title, name})
        .then((result) => {
          this.setState({
            participate: false
          });
          toastr.success('You take part in this event!');
        })
        .catch((error) => {
          if(error.response.status === 401) {
            toastr.error('Please Login!');
            this.props.history.push("/login");
          }
        });
      }
    }

    render() {
        moment.locale('en');
        const label = this.state.participate ?  'Participate' : 'Leave';
        const role = localStorage.getItem('role');
        return(
            <div className="container">
            <h3 className="event-title">{this.state.event.title}</h3>
            <div className="row">
                <div className="col-md-3">
                <img src={this.state.event.imageURL} className="event-img" alt="event"/>
                </div>
                <div className="col-md-8 offset-md-1">
                <h5><u>About the Event</u></h5>
                {moment(this.state.event.eventDate).isSameOrAfter() < 1 && <div className="event-title">This Event Has Passed</div> }
                <p>{this.state.event.description}</p>
                </div>
            </div>
            <div className="bg-light p-3 mt-3 border">
            <h5><u>Details</u></h5>
            <p><strong>Date: </strong>{moment(this.state.event.eventDate).format('LL')}</p>
            <p><strong>Time: </strong>{this.state.event.hours}:00 pm</p>
            <p><strong>Event Category: </strong><Link to={`/evcategory/${this.state.event.category}`} className="category">{this.state.event.category}</Link></p>
            {role === 'admin' && <Link to={`/editev/${this.state.event._id}`} className="btn btn-sm btn-secondary mr-1">Edit</Link>}
            {role === 'admin' && <button onClick={this.delete.bind(this, this.state.event._id)} className="btn btn-sm btn-secondary mr-1">Delete</button>}
            {moment(this.state.event.eventDate).isSameOrAfter() > 0 && <button onClick={this.eventAction.bind(this, this.state.event._id, this.state.event.title)} type="button" className="btn btn-sm btn-secondary mr-1">{label}</button>}
            </div>
            </div>
          );
      }
}

export default Event;