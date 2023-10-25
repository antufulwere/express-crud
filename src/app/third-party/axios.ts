import axios from 'axios';
import logger from '../../logger';
import config from "../../resources/config";
import querystring from 'querystring';

class AxiosHandler {
	async makePostCall(url: string, data: any, headers: any = {}): Promise<any> {
		try {
			console.log("calling-", url, "---", data)
			const result = await axios.post(url, data, { headers: headers });
			return result.data;
		} catch (error) {
			console.error(`Error in axios - error = ${error}.`)
			return false
		}
	}
	async getGoogleUserInfo(access_token) {
		const { data } = await axios({
			url: `https://www.googleapis.com/oauth2/v1/userinfo`,
			method: 'get',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		console.log(data); // { id, email, given_name, family_name }
		return data;
	};
}

const axiosHandler: AxiosHandler = new AxiosHandler();
export default axiosHandler;