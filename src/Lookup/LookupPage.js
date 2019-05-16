import React, { Component } from 'react';
import { Container, Card, CardBody, Badge, Row, Col, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'universal-cookie';
import * as moment from 'moment';
import Calendar from 'react-calendar';

class LookupPage extends Component {

	constructor(props) {
		super(props);
		this.arg_names = ['birth_date','birth_date_string','street_number','zip_code'];
		this.state = {
			args : [],
			working: false,
			fetching: false,
			data : null,
			error : null
		};
		this.arg_names.forEach(val => {
			this.state.args[val] = (val === 'birth_date') ? new Date(1960,0,1) : this.state.args[val] = '';
		});

	}

	onDateChange(d) {
		let n = Object.assign({}, this.state.args);
		n['birth_date'] = d;
		n['birth_date_string'] = moment(d).format('YYYY-MM-DD'); 
		this.setState({ args : n });
	}

	updateFieldState(e) {
		console.log(e.target.value);
		let n = Object.assign({}, this.state.args);
		n[e.target.name] = (e.target.value.replace(/[^A-z0-9 *]/gi,'') || '');
		this.setState({ args : n });
	}

	renderTextBox(field) {
		return (
			<div className="input-group input-group-sm">
				<div className="input-group-prepend input-group-prepend-sm"><div className="input-group-text">{field.title}</div></div>
				<input id={field.name} name={field.name} type="text" value={this.state.args[field.name] || ''} onChange={this.updateFieldState.bind(this)} className="form-control form-control-sm" placeholder="" autoComplete="off" />
			</div>
		);
	}

	renderCalendar() {
	    return (
	      <div>
	        <Calendar onChange={this.onDateChange.bind(this)} value={this.state.args['birth_date'] } maxDate={new Date()} isOpen={true} view={"century"} activeStartDate={new Date(1960,0,1)} />
	      </div>
	    );
	}

	renderFields() {
		if(this.state.fetching) return;
		let max_year = new Date().getFullYear();
		return (
			<Card className="">
				<CardBody>
					<Row className="mb-1">
						<Col md="4"><h5>Select Date Of Birth</h5>
						{this.renderCalendar()}</Col>
					</Row>
					<Row className="mb-1">
						<Col md="4">
							<div className="input-group input-group-sm">
								<div className="input-group-prepend input-group-prepend-sm"><div className="input-group-text">Birth Date</div></div>
								<p className="form-control form-control-sm">{this.state.args['birth_date_string'] || ''}</p>
							</div>
						</Col>
					</Row>					
					<Row className="mb-1">
						<Col md="5">{this.renderTextBox({name: 'street_number', title : 'Street Number'})}</Col>
					</Row>
					<Row>
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
				<form>
					{this.renderFields()}
				</form>
				<div>{this.state.args['birth_date'].toString() || ''}</div>
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