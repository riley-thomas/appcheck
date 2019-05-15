import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class InputSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search_string : this.props.value,
		};
	}

	handleEnterPressed(event) {
		if(event.key === 'Enter'){
			this.props.handleChange(this.state.search_string);
		}
	}
	handleChanged(event) {
		this.setState({ search_string : event.target.value });
	}

	render() {
		return (
			<div className="input-group">
				<input name="search_string" onChange={ this.handleChanged.bind(this) } value={this.state.search_string} className="form-control" placeholder={this.props.placeholder} onKeyPress={this.handleEnterPressed.bind(this)} />
				<div className="input-group-append">
					<button className="btn btn-primary" onClick={ () => this.props.handleChange(this.state.search_string)}>
						<FontAwesomeIcon icon="search" />
						<span className="sr-only">Search</span>
					</button>
				</div>
			</div>
		);
	}

}

export default InputSearch;