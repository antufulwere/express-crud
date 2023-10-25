export default class UserVariables {
	constructor() { }
	static EMAIL_LOGIN = ['admin', 'broker'];
	static ESTABLISHMENT_KEY_LENGHT = 10;
	// static SAFETY_LEAD_ROLE = 'SAFTEYLEAD';
	static SAFETY_LEAD_ROLE = 'LEADERSHIP';
	static SUPER_ADMIN_ROLE = 'SUPERADMIN';
	static DELETED_VALUE = 'Deleted';
	static USER_POSITIONS = ['BOH', 'FOH', 'both'];
	static SAFTEY_LEAD_ROLES_PERMISSION = ['EMPLOYEE', 'SUPERVISOR'];
	static FORBBIDEN_ROLES = [this.SUPER_ADMIN_ROLE];
	static MICRO_TRAINING_TYPE = 'micro'
	static MICRO_COURSE_TYPE = 'MANDATORY'
	static MICRO_EXTRA_TYPE = 'OPTIONAL'
	static ON_BOARDING_TRAINING_TYPE = 'onBoarding'
	static INACTIVE_STATUS = 'Inactive'
	static ACTIVE_STATUS = 'Active'
	static DELETED_STATUS = 'Deleted'
	static FORBBIDEN_STATUS = [this.INACTIVE_STATUS, this.DELETED_STATUS];
	static FORMS_ROLE = [this.SUPER_ADMIN_ROLE, this.SAFETY_LEAD_ROLE];
	static COMPLETE_STATUS = 'COMPLETED'
	static BROKER_ROLE = 'BROKER';
	static MICRO_WEIGHTAGE = 'microWeightage'
	static FOUNDATION_WEIGHTAGE = 'foundationWeightage'
	static CHECKLIST_WEIGHTAGE = 'checklistWeightage'
	static FORM_WEIGHTAGE = 'formWeightage'
	static WEIGHTAGE = [this.MICRO_WEIGHTAGE, this.FOUNDATION_WEIGHTAGE, this.CHECKLIST_WEIGHTAGE, this.FORM_WEIGHTAGE];
	static PASSWORD_LENGTH = 6;
	static REFRESH_TOKEN = 24;
	static CAPITALIZATION = {
		LOWERCASE: 'lowercase',
		UPPERCASE: 'uppercase'
	};
	static USER_ROLES_LIKE_SAFETY_LEAD = ['leadership'];

	static REMINDER_NOTIFICATION_DUE_DAYS = 3;
}