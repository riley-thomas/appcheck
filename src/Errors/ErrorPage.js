import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Error.css';

class ErrorPage extends Component {


	renderError(){
		return (
		 <div className="mt-3 text-center">
		 	<h1 className="display-1 text-danger error-page">
		 		<FontAwesomeIcon icon="exclamation-circle" /> 404
		 	</h1>
		 	<h3>Sorry, the page you requested could not be found.</h3>
		 </div>
		);
	}

	render() {
		return (
			<Container>
				{ this.renderError() }
			</Container>
		);
	}

}

export default ErrorPage;