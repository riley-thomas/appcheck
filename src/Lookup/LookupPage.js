import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as moment from 'moment';
import AppFetcher from './AppFetcher';
import AppStatusMessage from './AppStatusMessage';
import Lang from '../data/Lang.js';

class LookupPage extends Component {

	constructor(props) {
		super(props);
		this.arg_names = ['birth_date','birth_date_string','street_number','zip_code'];
		this.state = {
			language : this.props.route.match.params.language,
			today : new Date(),
			max_date : moment().subtract(15,'years').toDate(),
			min_date : moment().subtract(110,'years').toDate(),
			args : [],
			fetching: false,
			data : null,
			error : null
		};
		this.arg_names.forEach(val => {
			//this.state.args[val] = (val === 'birth_date') ? new Date(1965,0,1) : this.state.args[val] = '';
			this.state.args[val] = '';
		});

	}

	updateFieldState(e) {
		let n = Object.assign({}, this.state.args);
		if(e.target.name ==='street_number') {
			if( /[^0-9]/.test(e.target.value)) return;
			if(e.target.value.length > 7) return;
		}
		if(e.target.name ==='zip_code') {
			if( /[^0-9]/.test(e.target.value)) return;
			if(e.target.value.length > 5) return;
		}
		if(e.target.name ==='birth_date') {
			n['birth_date_string'] = null;
			if(! /[-/\d]/.test(e.target.value)) return;
			if(/^(\d{1,2}[-/]{1}){2}(19|20)\d{2}$/.test(e.target.value)){
				if(moment(e.target.value).isValid()) {
					n['birth_date_string'] = moment(e.target.value).format('YYYY-MM-DD'); 
				}
			}
			
		}
		n[e.target.name] = (e.target.value.replace(/[^-/A-z0-9 *]/gi,'') || '');
		this.setState({ args : n });
	}

	fetchApp(){
		this.setState({fetching: true});
		AppFetcher({ fields : this.state.args }).then( (response) => {
			if(response.status === 200)	this.setState({data : response.data});
			this.stopWorking();
        }).catch((e)=> { 
        	this.setState({data: null, error : 'Error'}, ()=> {	console.error(e)});
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
					<Col md="5">{this.renderTextBox({name: 'birth_date', title : Lang[this.state.language]['birth_date']})}</Col>
				</Row>				
				<Row className="mb-1">
					<Col md="5">{this.renderTextBox({name: 'street_number', title : Lang[this.state.language]['street_number']})}</Col>
				</Row>
				<Row className="mb-1">
					<Col md="5">{this.renderTextBox({name: 'zip_code', title : Lang[this.state.language]['zip_code']})}</Col>
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
							<Card><CardBody><AppStatusMessage data={this.state.data} language={this.state.language} /></CardBody></Card>
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