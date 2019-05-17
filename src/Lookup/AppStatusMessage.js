import React, { Component } from 'react';

class AppStatusMessage extends Component {

	render() {
		let data = this.props.data;
	   	return (
	   		<div>
	   			{data.response}
			</div>
	   	);
	}

}

export default AppStatusMessage;