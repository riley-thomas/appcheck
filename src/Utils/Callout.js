import React, { Component } from 'react';

class Callout extends Component {


	render() {
		let classnames = this.props.type ? 'bs-callout bs-callout-'+this.props.type+' text-'+this.props.type +' '+this.props.className : 'bs-callout bs-callout-default '+this.props.className;
		let Tagname = this.props.tagname ? this.props.tagname : 'p';
		return (<Tagname className={classnames}>
				{ this.props.children }
			</Tagname>);
	}

}

export default Callout;
					