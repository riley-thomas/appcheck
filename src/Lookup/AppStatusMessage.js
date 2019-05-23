import React, { Component } from 'react';
import Lang from '../data/Lang.js';

class AppStatusMessage extends Component {

	render() {
		let language = this.props.language || 'en';
		let data = this.props.data;
		let subs = ['site','timeslot','site_address','status','waitlist','waitnumber','waitsite_address'];
		let message = '';
		/* let sample = {	
			"response":"one",
			"detail":{
				"site":"PEND",
				"timeslot":"",
				"site_address":"",
				"site_address2":"",
				"site_city":"",
				"status":"ACTIVE",
				"waitlist":"ACGN",
				"waitnumber":1,
				"waitsite_address":"2 Diana Street",
				"waitsite_address2":"",
				"waitsite_city":"San Francisco",
				"waitsite_zip":"94124",
				"is_dup":"0",
				"participant_id":39617
			}
		} */

		switch(data.response) {
			case 'one':
				switch(data.detail.status.toLowerCase()) {
                    case "terminated":
                        message = 'application_response_terminated';
                        break;

                    case "inactive":
                        if(data.detail.waitlist) {
                            message = 'application_response_inactive_wait';
                        } else {
                            message = 'application_response_inactive_nowait';
                        }
                        break;

                    case "active":
                        if(data.detail.waitlist) {
                            if('pend' === data.detail.site.toLowerCase()) {
                                message = 'application_response_active_wait_pend';
                            } else {
                                if(data.detail.is_dup === '1') {
                                    message = 'application_response_active_wait_nopend_dup';
                                } else {
                                    message = 'application_response_active_wait_nopend_nodup';
                                }
                            }
                        } else {
                            if ('pend' === data.detail.site.toLowerCase()) {
                                message = 'application_response_active_nowait_pend';
                            } else {
                                if(data.detail.is_dup === '1') {
                                    message = 'application_response_active_nowait_nopend_dup';
                                } else {
                                    message = 'application_response_active_nowait_nopend_nodup';
                                }
                            } 
                        }
                        break;

                    default:
                        message = 'application_response_error';
                        break;
				}
				break;

			case 'zero':
				message = 'application_response_zero';
				break;

			case 'multiple':
				message = 'application_response_multiple';
				break;

			default:
				message = 'application_response_error';
				break;
		}
		let text = Lang[language][message];
		if(data.detail) {
			subs.forEach(val => {
				let regex = '%'+val+'%';
				text = text.replace(regex,data.detail[val]);
			});
		}
		let Tagname = this.props.tagname ? this.props.tagname : 'p';
		return (<Tagname className={this.props.className || ''}>
				{ text }
			</Tagname>);
	}

}

export default AppStatusMessage;