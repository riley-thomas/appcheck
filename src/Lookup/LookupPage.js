import React, { Component } from 'react';
import { Container, Card, CardBody, Badge, Row, Col, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'universal-cookie';
import * as moment from 'moment';

class LookupPage extends Component {

	constructor(props) {
		super(props);
		this.arg_names = [
			'birth_year','birth_month','birth_day','zip_code','street_number'
		];
		this.state = {
			working: true,
			fetching: false,
			data : null,
			args : [],
			error : null
		};
		this.arg_names.forEach(val => this.state.args[val] = '');
	}




	stopWorking() {
		this.setState({working:false, fetching: false});
	}

	updateFilterState(e) {
		let n = Object.assign({}, this.state.args);
		if(e.target.type === 'checkbox'){
			n[e.target.name] = e.target.checked ? true : false;
			this.setState({ args : n });
		} else if (e.target.type === 'number'){
			if(e.target.value.match(/^[0-9]{1,4}$/) || e.target.value === '') {
				n[e.target.name] = (e.target.value || '');
				this.setState({ args : n });
			}
		} else {
			n[e.target.name] = (e.target.value.replace(/[^A-z0-9 *]/gi,'') || '');
			this.setState({ args : n });
		}
	}

	renderTextBox(field) {
		return (
			<div className="input-group input-group-sm">
				<div className="input-group-prepend input-group-prepend-sm"><div className="input-group-text">{field.title}</div></div>
				<input id={field.name} name={field.name} type="text" value={this.state.args[field.name] || ''} onChange={this.updateFilterState.bind(this)} className="form-control form-control-sm" placeholder="" autoComplete="off" />
			</div>
		);
	}

	renderNumberBox(field) {
		return (
			<div className="input-group input-group-sm">
				<div className="input-group-prepend input-group-prepend-sm"><div className="input-group-text">{field.title}</div></div>
				<input id={field.name} name={field.name} type="number" min={field.min} max={field.max} value={this.state.args[field.name] || ''} onChange={this.updateFilterState.bind(this)} className="form-control form-control-sm" placeholder="" autoComplete="off" />
			</div>
		);
	}

	renderSelectBox(field) {
		let options = field.options.map((v,k) =>{
	   		return ( <option key={k} value={v.value}>{v.display_value}</option> );
	   	});
	   	return (
	   		<div className="input-group input-group-sm">
	   			<div className="input-group-prepend input-group-prepend-sm"><div className="input-group-text">{field.title}</div></div>
	   			<select name={field.name} onChange={this.updateFilterState.bind(this)} className="form-control form-control-sm" value={this.state.args[field.name]}>{options}</select>
	   		</div>
	   	);
	}

	renderCheckBox(field) {
		return (
			<div className="form-check">
				<input id={field.name} name={field.name} type="checkbox" checked={this.state.args[field.name] || false } onChange={this.updateFilterState.bind(this)} className="form-check-input" />
				<label htmlFor={field.name} className="form-check-label">{field.title}</label>
			</div>
		);
	}
	
	renderPriorityButton(i) {
		let icon = this.state.priorityFilter[i] === i ? 'check-square' : 'square';
		return (<li key={i} className="list-inline-item" onClick={() => this.changePriority(i)}><FontAwesomeIcon icon={['far', icon]} /><span className="cursor-default"> {i}</span></li>);
	}

	changePriority(i) {
		const priority = this.state.priorityFilter.slice();
		priority[i] = priority[i] === i ? '' : i;
		this.setState({	priorityFilter: priority });
	}

	renderFilters() {
		if(this.state.fetching) return;
		let max_year = new Date().getFullYear();
		return (
			<Card className="mb-1">
				<CardBody>
					<Row className="mb-1">
						<Col md="4">{this.renderNumberBox({name: 'birth_month', title : 'Birth Month', min : 1, max : 12})}</Col>
						<Col md="4">{this.renderNumberBox({name: 'birth_day', title : 'Birth Day', min : 1, max : 31})}</Col>
						<Col md="4">{this.renderNumberBox({name: 'birth_year', title : 'Birth Year', min : 1900, max: max_year})}</Col>
					</Row>
					<Row className="mb-1">
						<Col md="5">{this.renderTextBox({name: 'street_number', title : 'Street Number'})}</Col>
						<Col md="2">{this.renderTextBox({name: 'zip_code', title : 'Zip'})}</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}

	renderPage() {
		if(this.state.error) return (<Container><Alert color="danger">{this.state.error || 'Error'}</Alert></Container>);
		let hr = this.state.expanded === 'open' ? '' : <hr />;
		return (
			<Container fluid className="content">	
				{this.renderFilters()}
			</Container>
		);
	}


	render() {
		return (
			<div>{this.renderPage()}</div>
		);
	}

}

export default LookupPage;