import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CounterIcon extends Component {

	render() {
	   	return (
			<span>
				<span className="fa-layers fa-fw fa-lg">
					<FontAwesomeIcon icon={this.props.icon} />
					<span className="fa-layers-counter fa-lg" style={{'background':'Tomato'}}>{this.props.counter}</span>
				</span> {this.props.text}
			</span>
	   	);
	}

}

export default CounterIcon;