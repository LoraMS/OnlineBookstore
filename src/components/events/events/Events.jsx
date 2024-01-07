import React, { Component } from 'react';
import { withRouter } from 'react-router'
import axios from 'axios';
import moment from 'moment';
import toastr from 'toastr';
import EventsComponent from './EventsComponents';
import Search from './../../common/Search';
import PageNotFound from './../../common/PageNotFound';
import LoadIndicator from './../../common/LoadIndicator';
import './Events.css';

class Events extends Component {
    constructor(props){
        super(props);
        this.state= {
            events: [],
            query: '',
            buttonPart: true,
        }; 
    }

    componentDidMount() {
        axios.get('/api/event')
        .then(res => {
            this.setState({ events: res.data });
        })
          .catch((error) => {
            if(error.response.status === 401) {
              this.props.history.push("/");
            }
          });
          
    }

    handleSearch(event){
		this.setState({query: event.target.value});
    }
    
    eventAction(eventId, title){
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        const name = localStorage.getItem('name');
        const currentEvent = this.state.events.find(e => e._id === eventId);
        const index = currentEvent.users.findIndex(u => u  ===  name);
               if(index > -1){
                axios.put('/api/auth/leave', {eventId, name})
                .then((result) => {
                    // this.props.history.go(0);
                    this.props.history.push("/event/" + eventId);
                    toastr.success('You leave the event.');
                })
                .catch((error) => {
                       if(error.response.status === 401) {
                       this.props.history.push("/login");
                      }
                });
               } else {
                axios.put('/api/auth/participate', {eventId, title, name})
                .then((result) => {
                // this.props.history.go(0);
                this.props.history.push("/event/" + eventId);
                toastr.success('You take part in this event.');
                })
                .catch((error) => {
                    if(error.response.status === 401) {
                       this.props.history.push("/login");
                      }
                });
               }
      }

    render(){
        moment.locale('en');
        const EventsWithLoadIndicator = LoadIndicator('events')(EventsComponent);       
        
        let view;
        let filteredItems = this.state.events.filter(e => e.title.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1);
        
        if(filteredItems.length <= 0 && this.state.query){
        view = <PageNotFound />
        } else {
        view = <EventsWithLoadIndicator events={filteredItems} eventAction={this.eventAction.bind(this)} buttonPart={this.state.buttonPart} />  
            }

        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                    <h2 className="event-title">Events</h2>
                    </div>
                    <div className="col-md-4 offset-md-4">
                    <Search search={this.handleSearch.bind(this)} />
                    </div>
                </div>
                <div className="py-5">
                {view}
                </div>
            </div>
        );
    }
}

export default withRouter(Events);
                              


        
      
