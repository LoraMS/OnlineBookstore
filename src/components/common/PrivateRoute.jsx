import React, { Component } from 'react';
import toastr from 'toastr';

const PrivateRoute = ComposedComponent => {
    return class Authentication extends Component {
		componentDidMount() {
			if(this.props.role !== 'admin') {
				toastr.error('Access denied!')
				this.props.history.push('/login');			
			}
		}

		render() {
			return(
				<div>
					<ComposedComponent {...this.props} />
				</div>
			)
		}
	}
} 

export default PrivateRoute;



