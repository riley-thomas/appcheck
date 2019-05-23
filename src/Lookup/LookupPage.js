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
			max_date : moment().subtract(15,'years'),
			min_date : moment().subtract(120,'years'),
			args : [],
			fetching: false,
			data : null,
			error : null
		};
		this.arg_names.forEach(val => {
			// eslint-disable-next-line
			this.state.args[val] = '';
			// eslint-disable-next-line
			this.state.args[val+'_class'] = '';
		});

	}

	validateField(field, value) {
		switch (field) {
			case 'street_number':
				return /^[0-9]{1,7}$/.test(value);
				//break;
			case 'zip_code':
				return /^9(4|9)[0-9]{3}$/.test(value);
				//break;
			case 'birth_date':
				if(moment(value,"M/D/YYYY").isValid()) {
					return (moment(value,"M/D/YYYY").isBetween(this.state.min_date, this.state.max_date));
				}
				return false;
				//break;
			default:
				// 
				break;
		}
	}

	validateForm() {
		if(!this.validateField('street_number',this.state.args['street_number'])) return false;
		if(!this.validateField('zip_code',this.state.args['zip_code'])) return false;
		if(!moment(this.state.args['birth_date_string'],"YYYY-M-D").isValid()) return false;
		return true;
	}

	updateFieldState(e) {
		let n = Object.assign({}, this.state.args);
		let isvalid = this.validateField(e.target.name, e.target.value);
		let classname = '';
		n[e.target.name+'_class'] = '';
		if(e.target.name ==='street_number') {
			if(e.target.value.length > 0){
				if(!isvalid) return; 
				classname = 'is-valid';
			}
		}
		if(e.target.name ==='zip_code') {
			if( /[^0-9]/.test(e.target.value)) return;
			if(e.target.value.length > 5) return;
			if(e.target.value.length === 5) {
				classname = isvalid ? 'is-valid' : 'is-invalid';		
			}
		}
		if(e.target.name ==='birth_date') {
			n['birth_date_string'] = null;
			if(e.target.value.length > 10) return;
			if(/[^/0-9]/.test(e.target.value)) return;
			if(/^(\d{1,2}\/){2}\d{4}$/.test(e.target.value)) {
				if(isvalid) {
					n['birth_date_string'] = moment(e.target.value).format('YYYY-MM-DD'); 
					classname = 'is-valid';
				} else {
					classname = 'is-invalid';
				}
			}	
		}
		n[e.target.name+'_class'] = classname;
		n[e.target.name] = (e.target.value.replace(/[^/0-9]/gi,'') || '');
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
		let isdisabled = this.state.fetching ? 'disabled' : '';
		let cssNames = (this.state.args[field.name+'_class']) ? 'form-control form-control '+this.state.args[field.name+'_class'] : 'form-control form-control';
		return (
			<div className="input-group input-group">
				<div className="input-group-prepend input-group-prepend"><div className="input-group-text">{field.title}</div></div>
				<input id={field.name} name={field.name} type="text" value={this.state.args[field.name] || ''} onChange={this.updateFieldState.bind(this)} className={cssNames}  autoComplete="off" disabled={isdisabled} placeholder={field.placeholder || ''} />
			</div>
		);
	}

	renderLookupButton() {
		if(this.validateForm()) {
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
					<Col md="5">{this.renderTextBox({name: 'birth_date', title : Lang[this.state.language]['birth_date'], placeholder: '--/--/----' })}</Col>
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