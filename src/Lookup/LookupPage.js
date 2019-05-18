import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as moment from 'moment';
import Calendar from 'react-calendar';
import AppFetcher from './AppFetcher';
import AppStatusMessage from './AppStatusMessage';

class LookupPage extends Component {

	constructor(props) {
		super(props);
		this.arg_names = ['birth_date','birth_date_string','birth_date_display_string','street_number','zip_code'];
		this.state = {
			today : new Date(),
			max_date : moment().subtract(15,'years').toDate(),
			min_date : moment().subtract(110,'years').toDate(),
			args : [],
			fetching: false,
			data : null,
			error : null
		};
		this.arg_names.forEach(val => {
			this.state.args[val] = (val === 'birth_date') ? new Date(1965,0,1) : this.state.args[val] = '';
		});

	}

	onDateChange(d) {
		let n = Object.assign({}, this.state.args);
		n['birth_date'] = d;
		n['birth_date_string'] = moment(d).format('YYYY-MM-DD'); 
		n['birth_date_display_string'] = moment(d).format('M/DD/YYYY'); 
		this.setState({ args : n });
	}

	updateFieldState(e) {
		if(e.target.name ==='street_number') {
			if( /[^0-9]/.test(e.target.value)) return;
			if(e.target.value.length > 7) return;
		}
		if(e.target.name ==='zip_code') {
			if( /[^0-9]/.test(e.target.value)) return;
			if(e.target.value.length > 5) return;
		}
		let n = Object.assign({}, this.state.args);
		n[e.target.name] = (e.target.value.replace(/[^A-z0-9 *]/gi,'') || '');
		this.setState({ args : n });
	}

	fetchApp(){
		this.setState({fetching: true});
		AppFetcher({ fields : this.state.args }).then( (response) => {
			if(response.status === 200)	this.setState({data : response.data});
        }).catch((e)=> { 
        	this.setState({data: null, error : 'Error'}, ()=> {	console.error(e)});
        }).finally(()=> {
        	this.stopWorking();
        });
	}

	stopWorking() {
		this.setState({fetching: false});
	}

	renderTextBox(field) {
		let disabled = this.state.fetching ? 'disabled' : '';
		return (
			<div className="input-group input-group">
				<div className="input-group-prepend input-group-prepend"><div className="input-group-text">{field.title}</div></div>
				<input id={field.name} name={field.name} type="text" value={this.state.args[field.name] || ''} onChange={this.updateFieldState.bind(this)} className="form-control form-control" placeholder="" autoComplete="off" disabled={disabled} />
			</div>
		);
	}

	renderCalendar() {
	    return (
	      <div>
	        <Calendar onChange={this.onDateChange.bind(this)} minDate={this.state.min_date}  maxDate={this.state.max_date} isOpen={true} view={"decade"} activeStartDate={new Date(1965,0,1)} calendarType="US" />
	      </div>
	    );
	}

	renderLookupButton() {
		if(this.state.args['street_number'].length > 0 && /^9[0-9]{4}$/.test(this.state.args['zip_code']) && /\d{4}-\d{2}-\d{2}/.test(this.state.args['birth_date_string'])) {
			if(this.state.fetching) {
				return (
					<button type="button" className="btn btn-primary btn-block" disabled>
						<FontAwesomeIcon icon="spinner" size="1x" pulse /> Searching...
					</button>
				)
			}
			return (
				<button type="button" className="btn btn-primary btn-block" onClick={() => this.fetchApp()}>
					<FontAwesomeIcon icon="search" size="1x" /> Search
				</button>
			)
		}
	}

	renderFields() {
		return (			
			<Container>
				<Row className="mb-1">
					<Col md="5"><h5>Select Date Of Birth</h5>{this.renderCalendar()}</Col>
				</Row>
				<Row className="mb-2">
					<Col md="5">
						<div className="input-group input-group">
							<div className="input-group-prepend input-group-prepend-sm"><div className="input-group-text">Birth Date</div></div>
							<p className="form-control form-control">{this.state.args['birth_date_display_string'] || ''}</p>
						</div>
						<small className="form-text text-muted">Use the calendar above to select date of birth</small>
					</Col>
				</Row>					
				<Row className="mb-1">
					<Col md="5">{this.renderTextBox({name: 'street_number', title : 'Street Number'})}</Col>
				</Row>
				<Row className="mb-1">
					<Col md="5">{this.renderTextBox({name: 'zip_code', title : 'Zip'})}</Col>
				</Row>
				<Row className="mb-1">
					<Col md="5">{this.renderLookupButton()}</Col>
				</Row>
			</Container>
		);
	}

	renderAppStatusMessage() {
		if(this.state.data){
			return (
				<Container>
					<Row className="mt-2">
						<Col md="5">
							<Card><CardBody><AppStatusMessage data={this.state.data} /></CardBody></Card>
						</Col>
					</Row>
				</Container>
			)
		}
	}

	renderPage() {
		if(this.state.error) return (<Container className="mt-2"><Alert color="danger">{this.state.error || 'Error'}</Alert></Container>);
		return (
			<Container fluid className="content">	
				<form>
					{this.renderFields()}
				</form>
				<div className="mt-1">{this.renderAppStatusMessage()}</div>
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