import React, { Component } from 'react';
import moment from 'moment';
import { Container, Row, Col } from 'reactstrap';

class Footer extends Component {

	render() {
		const d = moment(); 
		let y = d.format('YYYY');

		return (
			<footer className="nav-footer" id="footer">
				<Container fluid>
					<Row>
						<Col md="5" className="text-right"><span className="d-none d-md-inline">JRT</span> &copy;{ y }</Col>
					</Row>
				</Container>
			</footer>
		);
	}

}

export default Footer;