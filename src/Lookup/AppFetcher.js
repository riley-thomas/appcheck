import axios from 'axios';
import Config from '../Config.js';

const AppFetcher = (args) => { 
	let url = Config.check_base_url + '?key=' + Config.check_key + '&d='+args.fields.birth_date_string +'&z='+args.fields.zip_code+'&s='+args.fields.street_number;
	return new Promise((resolve, reject) => {
		axios.get(url).then((response) => {
			resolve(response);
		}).catch(error => reject(error));	
	});
}
export default AppFetcher;