import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import toastr from 'toastr';
import EventsComponent from './../events/events/EventsComponents';
import './../events/events/Events.css';

export default class CategoryEvent extends Component {
    constructor(props){
        super(props);
        this.state= {
            events: [],
            buttonPart: false,
        }; 
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/event/evcategory/' + this.props.match.params.name)
          .then(res => {
            this.setState({ events: res.data });
          })
          .catch((error) => {
            if(error.response.status === 401) {
                toastr.error('Unauthorized. Please Login!');
                this.props.history.push("/login");
            }
          });
      }

    render(){
        moment.locale('en');
        return(
            <div className="container">
                <h2 className="event-title">Events in Category {this.props.match.params.name}</h2>
                <EventsComponent events={this.state.events} buttonCart={this.state.buttonPart}/>
            </div>
        );
    }
}
