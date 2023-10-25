export default class Messages {
	constructor() { }
	static ROLE_ALREADY_EXISTS = 'Role already exists';
	static KEY_ALREADY_EXISTS = 'The Location ID already exists';
	static SOMETHING_WENT_WRONG = 'Something went wrong';
	static ROLE_SUCCESS = 'Role created successfully';
	static UPDATE_SUCCESS = 'Data updated successfully';
	static DELETE_SUCCESS = 'Data deleted successfully';
	static SUCCESS_GET = 'Data fetched successfully';
	static USER_SUCCESS = 'User created successfully';
	static PASSWORD_NOT_MATCHED = "Password confirmation doesn't match Password";
	static USER_ALREADY_EXISTS = 'User already exists';
	static EST_ALREADY_EXISTS = 'The Location ID already exists';
	static INVALID_ROLE = 'Invalid role id received';
	static INVALID_ID = 'Invalid id received';
	static USER_NOT_FOUND = 'User not found';
	static PARENT_NOT_FOUND = 'Parent node not found';
	static LOCATION_NOT_FOUND = 'Location not found';
	static LOGIN_PASSWORD_NOT_MATCHED = 'Invalid password';
	static OLD_PASSWORD_INVALID = 'Invalid old password';
	static SUCCESS_LOGOUT = 'Successful logout';
	static SUCCESS_LOGIN = 'Successful login';
	static USER_PASSWORD_UPDATE = 'Password updated successfully';
	static EST_NOT_FOUND = 'Establishment not found';
	static UNAUTHORIZED = 'Unauthorized access';
	static ROLE_ASSOCIATION = 'Role cannot be deleted since it is being used in system';
	static PARENT_ALREADY_EXISTS = 'Parent already exists found';
	static ROLE_NOT_FOUND = 'Role not found'
	static ROLE_RESTRICT = 'Restricted role found'
	static EMAIL_NOT_FOUND = 'Establishment email not found'
	static FEEDBACK_SENT = 'Feedback sent successfully'
	static USER_TRAINING_NOT_FOUND = 'User training not found';
	static USER_CHECKLIST_NOT_FOUND = 'User checklist not found';
	static USER_CHECKLIST_IS_EXPIRED = 'User checklist is expired';
	static USER_TRAINING_IS_EXPIRED = 'User training is expired';
	static RESET_PASSWORD_ISSUE = 'Invalid link, Try generating a new link.';
	static INACTIVE_LOGIN = 'Location is inactive at the moment, Please try again later'
	static INACTIVE_USER_LOGIN = 'User is inactive at the moment, Please try again later'
	static DELETED_LOGIN = 'Location no longer exists'
	static FORM_NOT_FOUND = 'Form not found'
	static ROLE_ACCESS = 'Access denied'
	static SUMMARY_NOT_FOUND = 'Summary not found';
	static QUESTIONS_NOT_FOUND = 'Questions not found';
	static INCORRECT_RESPONSE = 'Incorrect response';
	static USER_ESTABLISHMENT_NOT_FOUND = 'User establishment not exist';
	static USER_ESTABLISHMENT_IMAGE_NOT_FOUND = 'User establishment image not exist';
	static ANSWER_ADDED = 'Answer added successfully';
	static ANSWER_ALREADY_EXIST = 'Answer already added';
	static USER_ROLE_EXIST = 'User role currently in use';
	static PASSWORD_CHANGE = 'passwordChange';
	static INVALID_2FACODE = 'Invalid 2FA code';
	static ESTABLISHMENT_COURSE_DATA_NOT_FOUND = 'Establishment course data not found';
	static INVALID_COURSE_ID = 'Invalid course id';
	static INVALID_TRAINING_ID = 'Invalid training id';
	static INVALID_CHECKLIST_ID = 'Invalid checklist id';
	static INVALID_USER_ID = 'Invalid user id';
	static INVALID_TRAINING_STATUS = 'Invalid training status';
	static TOKEN_NOT_FOUND_BY_AXIOS_CALL = 'Token not found by axios call';
	static TOKEN_NOT_FOUND = 'Token not found';
	static ERROR_WHILE_GENERATING_TOKEN_FOR_USER = 'Error while generating token for user';
	static USER_COURSE_TRAINING_DATA_NOT_FOUND = 'User course training data not found';
	static USER_ROLE_UPDATED = 'User role updated';

	static EMAIL = {
		SUBJECT: 'Added successfully',
		TRAINING: 'Training assigned successfully',
	}

	static CRON = {
		SCHEDULED: 'you have 3 days left in your training to end',
	}

	static SUPPORT_NOT_FOUND = (key: string) => {
		return `${key} not found`;
	};

	static SUPPORT_DATA = {
		SUPPORT_ID_NOT_FOUND: 'Support Id not found',
		SUPPORT_DATA_NOT_FOUND: 'Support Data not found',
		SUPPORT_DATA_UPDATED_SUCCESSFULLY: 'Support Data Updated Successfully',
	}

	static TRAINING_REMINDER = 'Training Reminder';
	static CHECKLIST_REMINDER = 'Checklist Reminder';

}
