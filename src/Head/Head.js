import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import Config from '../Config';

class Head extends Component {

	render() {
		return (
			<Helmet>
			    <title>{Config.app_title}</title>
			</Helmet>
		);
	}

}

export default Head;