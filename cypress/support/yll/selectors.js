const selectors = {
	pageSignIn: {
		emailInput: 'input[name="email"]',
		passwordInput: 'input[name="password"]',
	},
	pageHeadder: {
		appBar: 'header.MuiAppBar-root',
		userIcon: 'div.MuiAvatar-root.MuiAvatar-circular.MuiAvatar-colorDefault',
		appBarUsericon: 'header.MuiAppBar-root > img.MuiAvatar-img',
	},
	pageSignUp: {
		userEmailInput: 'input[name="userEmail"]',
		firstNameInput: 'input[name="firstName"]',
		lastNameInput: 'input[name="lastName"]',
		businessNameInput: 'input[name="businessName"]',
		businessPublicNameInput: 'input[name="businessPublicName"]',
		street1Input: 'input[name="street1"]',
		street2Input: 'input[name="street2"]',
		cityInput: 'input[name="city"]',
		stateSelector: 'select[name="state"]',
		zipcodeInput: 'input[name="zipcode"]',
		publicContactEmailInput: 'input[name="publicContactEmail"]',
		publicPhoneNumber: 'input[name="publicPhoneNumber"]',
	},
	passwordReset: {
		newPasswordInput: 'input[name="newPassword"]',
		confirmNewPasswordInput: 'input[name="confirmNewPassword"]',
	},
	dwollaForBorrower: {
		emailInput: 'input#emailInput',
		firstNameInput: 'input#firstNameInput',
		lastNameInput: 'input#lastNameInput',
		agreedCheckbox: 'input#checkbox[name="agreed"]',
		dwollaCustomerCreateSubmitButton:
			'input#dwolla-customer-create-submit[value="Agree and Continue"]',
	},
	dwollaForLenders_1: {
		emailInput: 'input[name="emailInput"]', // jekasemenuk+testlender_2@gmail.com
		firstNameInput: 'input[name="firstNameInput"]', // verified (Dwolla documentation said for "status: verified" we must send 'verified' in the "first name" of the form)
		lastNameInput: 'input[name="lastNameInput"]', // Semeniuk
		legalBusinessNameInput: 'input[name="legalBusinessName"]', // Legal Business Name
		businessTypeSelect: 'select[name="businessType"]', // LLC
		dwollaInitialInfoSubmitButton: 'input#dwolla-initial-info-submit',
	},
	dwollaForLenders_2: {
		doingBusinessAs: 'input[name="doingBusinessAs"]', // Doing Business As
		address1Input: 'input[name="address1"]', // Address 1
		address2Input: 'input[name="address2"]', // Address 2
		cityInput: 'input[name="city"]', // Kyiv
		stateSelect: 'select[name="state"]', // NY
		postalCodeInput: 'input[name="postalCode"]', // 12345
		businessClassificationSelect: 'select[name="businessClassification"]', // value="9ed35a29-7d6f-11e3-930b-5404a6144203"
		industrySelect: 'select[name="industry"]', // value="9ed35a2b-7d6f-11e3-942f-5404a6144203"
		einInput: 'input[name="ein"]', // 00-0000000
		companyControllerCheckbox: 'input[name="companyController"]', // true
		dwollaBusinessInfoSubmitButton: 'input#dwolla-business-info-submit',
	},
	dwollaForLenders_3_sole_proprietorship: {
		dateOfBirthControllerInput: 'input#dateOfBirthController', // 1998-05-31
		ssnController: 'input#ssnController', // 0000
		termsCheckbox: 'input#termsCheckbox', // true
		dwollaBusinessVcrSubmitButton: 'input#dwolla-business-vcr-submit',
	},
	dwollaForLenders_3_llc: {
		titleInputControllerInput: 'input[name="titleInputController"]', // My Title
		dateOfBirthControllerInput: 'input[name="dateOfBirthController"]', // 1998-05-31
		address1ControllerInput: 'input[name="address1Controller"]', // Address 1
		address2ControllerInput: 'input[name="address2Controller"]', // Address 2
		address3ControllerInput: 'input[name="address3Controller"]', // Address 3
		cityControllerInput: 'input[name="cityController"]', // Kyiv
		countryControllerSelect: 'select[name="countryController"]', // US
		stateControllerSelect: 'select[name="stateController"]', // NY
		postalCodeControllerInput: 'input[name="postalCodeController"]', // 12345
		ssnControllerInput: 'input[name="ssnController"]', // 0000
		agreedCheckbox: 'input[name="agreed"]', // true
		dwollaBusinessVcrSubmitButton: 'input#dwolla-business-vcr-submit',
	},
	dwollaForLenders_Add_Owners: {
		firstNameInput: `input[name="firstNameInputBO"]`,
		lastNameInput: `input[name="lastNameInputBO"]`,
		address1ControllerInput: `input[name="address1BO"]`,
		address2ControllerInput: `input[name="address2BO"]`,
		address3ControllerInput: `input[name="address3BO"]`,
		countryControllerSelect: `select[name="countryBO"]`,
		cityControllerInput: `input[name="cityBO"]`,
		stateControllerSelect: `select[name="stateBO"]`,
		postalCodeControllerInput: `input[name="postalCodeBO"]`,
		ssnControllerInput: `input[name="ssnBO"]`,
		dateOfBirthControllerInput: `input[name="dateOfBirthBO"]`,
		dwollaBusinessVcrSubmitButton: `input#add-owner-submit`,
	},
};

export default selectors;
