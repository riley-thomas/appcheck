import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from 'reactstrap';

class NotFoundBox extends Component {

	render() {
		return (
		 <div className="mt-5 text-center">
		    <Alert color="danger p-3 display-4">
		 		<FontAwesomeIcon icon="exclamation-circle" /> {this.props.message || 'Sorry, the requested resource cannot be displayed at this time.'}
      		</Alert>
		 </div>
		);
	}

}

export default NotFoundBox;	