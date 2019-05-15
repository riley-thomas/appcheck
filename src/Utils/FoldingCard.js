import React, { Component } from 'react';
import { Card, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'universal-cookie';
import * as moment from 'moment';

class FoldingCard extends Component {


	constructor(props) {
		super(props);
		this.cookies = new Cookies();
		let cookiename = 'cardopen_'+(this.props.cardName ? this.props.cardName : (this.props.cardTitle || 'noname'));
		let open = this.cookies.get(cookiename) === 'closed' ? 'closed' : 'open';
		this.state = {
			cookiename : cookiename,
			expanded: open
		}
	}

	cardHeader() {
		return (
			<CardHeader 
				tag={(this.props.headerTag || 'h4')} 
				className={'cursor-default '+(this.props.headerClass || 'bg-secondary text-white')} 
				onClick={()=>this.expand()}
			>{this.props.cardTitle} <span className='float-right'>{this.cardIcon()}</span></CardHeader>
		)
	}
	cardIcon() {
		let icon = this.state.expanded === 'open' ? 'chevron-up' : 'chevron-right';
		return (
			<FontAwesomeIcon icon={icon} />
		)
	}
	cardBody() {
		return (
			<div className={(this.state.expanded === 'open' ? '' : 'd-none')}>
				{this.props.children}
			</div>
		)
	}
	card() {
		return (
			<Card className={this.props.className+' '+(this.props.cardBorder || "border-secondary")}>
				{this.cardHeader()}
				{this.cardBody()}
			</Card>
		)
	}

	expand(val) {
		let open = this.state.expanded === 'open' ? 'closed' : 'open';
		let expires = moment().add(365, 'days').toDate();
		this.setState({expanded : open}, ()=>{
			this.cookies.set(this.state.cookiename, open, { path : '/', expires : expires })
		})
	}

	render() {

	   	return (
			<div>{this.card()}</div>
	   	);

	}

}

export default FoldingCard;