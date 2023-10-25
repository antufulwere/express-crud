import jwt from 'jsonwebtoken';

class JwtHandler {
	generateNewToken(userId: string): string {
		const exp_payload = { data: 'arrow-up', userId };
		const token = jwt.sign(
			exp_payload,
			'sdfbsdbfHMACdsf',
			{ algorithm: 'HS256' }
		);

		return token;
	}
}

const jwtHandler: JwtHandler = new JwtHandler();
export default jwtHandler;
