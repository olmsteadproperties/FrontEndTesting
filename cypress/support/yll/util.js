import { appPaths } from './paths';
import selectors from './selectors';

const DEV_API_URL = Cypress.env('devApiUrl');

let lastLoggedInUser = '';

const login = ({
	account,
	forwardUrl = '',
	loginUrl = '',
	logoutFirst = true,
	force = false,
}) => {
	if (lastLoggedInUser.toLowerCase() != account.email.toLowerCase() || force) {
		Cypress.on('uncaught:exception', (err, runnable) => {
			return false; //Dangeriously ignoring all uncaught exceptions
		});

		let logoutFinished = true;
		if (logoutFirst) {
			logoutFinished = false;
			logout(() => {
				logoutFinished = true;
			});
		}

		cy.waitUntil(() => logoutFinished, {
			errorMsg: 'Never logged out.',
			timeout: Cypress.config('defaultCommandTimeout'),
		}).then(() => {
			lastLoggedInUser = account.email;
			loginUrl = loginUrl !== '' ? loginUrl : appPaths.login;

			cy.visit(loginUrl);

			cy.wait(500);

			cy.get(selectors.pageSignIn.emailInput).clear().type(account.email);

			const encodedPassword = encodeURIComponent(account.password);

			cy.get(selectors.pageSignIn.passwordInput)
				.clear()
				.type(decodeURIComponent(encodedPassword));

			cy.contains('button', 'Login').click();

			if (forwardUrl != '') {
				cy.visit(forwardUrl);
			}
		});
	}
};

const logout = (success = () => {}, failure = () => {}) => {
	lastLoggedInUser = '';

	cy.visit(appPaths.base);

	containsText('h4', 'Sign in to Your Land Loans').then((result) => {
		if (result) {
			//Already logged out.
			success();
		} else {
			exists(selectors.pageHeadder.appBar).then((result) => {
				if (result) {
					cy.get(`button[data-cy="avatar"]`).click({ force: true }); // dot'n delete "force" here!

					cy.contains('button', 'Logout').click();

					cy.wait(1000);

					cy.url()
						.should('contain', '/login')
						.then(() => {
							success();
						});
				} else {
					failure();
				}
			});
		}
	});
};

const signup = (dataAccount) => {
	if (dataAccount) {
		const arrSelect_signup = [
			{
				select: selectors.pageSignUp.userEmailInput,
				typeText: dataAccount.email,
			},
			{
				select: selectors.pageSignUp.firstNameInput,
				typeText: dataAccount.firstName,
			},
			{
				select: selectors.pageSignUp.lastNameInput,
				typeText: dataAccount.lastName,
			},
			{
				select: selectors.pageSignUp.businessNameInput,
				typeText: dataAccount.businessName,
			},
			{
				select: selectors.pageSignUp.businessPublicNameInput,
				typeText: dataAccount.businessPublicName,
			},
			{
				select: selectors.pageSignUp.street1Input,
				typeText: dataAccount.street1,
			},
			{
				select: selectors.pageSignUp.street2Input,
				typeText: dataAccount.street2,
			},
			{
				select: selectors.pageSignUp.cityInput,
				typeText: dataAccount.city,
			},
			{
				select: selectors.pageSignUp.stateSelector,
				optionText: dataAccount.state,
			},
			{
				select: selectors.pageSignUp.zipcodeInput,
				typeText: dataAccount.zipcode,
			},
			{
				select: selectors.pageSignUp.publicContactEmailInput,
				typeText: dataAccount.publicContactEmail,
			},
			{
				select: selectors.pageSignUp.publicPhoneNumber,
				typeText: dataAccount.publicPhoneNumber,
			},
		];

		arrSelect_signup.forEach((el) => {
			'typeText' in el
				? cy.get(el.select).clear({ force: true }).type(el.typeText)
				: cy.get(el.select).select(el.optionText);
		});
	}

	cy.contains('button', 'Create Lender Account').click();
};

const increaseTimeout = (time, temporary = true) => {
	const defaultCommandTimeout = Cypress.config('defaultCommandTimeout');
	Cypress.config('defaultCommandTimeout', time);
	if (temporary) {
		setTimeout(() => {
			Cypress.config('defaultCommandTimeout', defaultCommandTimeout);
		}, time);
	}
};

const closePopup = ({ wait = 0, text = 'Close' } = {}) => {
	///modified for different text of close  button
	if (text.includes('Ok', 'Confirm')) {
		cy.contains('Notice')
			.parents('div')
			.first()
			.within(() => {
				cy.contains(text).click({ force: true });
			});
	} else {
		containsText('button', text, wait).then(($isExist) => {
			if ($isExist) cy.contains('button', text).click({ force: true });
		});
	}
};

const navigate = (path, waitTime = 0) => {
	if (waitTime) {
		cy.wait(waitTime);
	}

	closePopup();

	if (path === appPaths.base) {
		cy.visit(path);
	} else if (path === appPaths.loansAddUser) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Borrowers').click();
				cy.contains('Add Borrower to loan').click();
				cy.contains('Borrowers').click(); // We unclick the expanded menu so we can call this over and over without having unexpected menu state.
			});
		cy.url().should('include', path);
	} else if (path === appPaths.loansMakePayment) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Payments').click();
				cy.contains('Make Payment').click();
				cy.contains('Payments').click();
			});
	} else if (path === appPaths.loansRecordPayment) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Payments').click();
				cy.contains('Record Payment').click();
				cy.contains('Payments').click();
			});
	} else if (path === appPaths.addPaymentAccount) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('div', 'Add Payment Method').click({ force: true });
			});
	} else if (path === appPaths.paymentMethods) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Payment Methods').click();
				cy.contains('Payment Methods')
					.get('a div')
					.contains('Payment Methods')
					.click({ force: true });
				cy.contains('Payment Methods').click({ force: true });
			});
	} else if (path === appPaths.assistanceRequests) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Assistance Requests').click();
			});
	} else if (path === appPaths.addNewLoan) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Loans').click();
				cy.contains('Add New Loan').click();
				cy.contains('Loans').click();
			});
		cy.url().should('include', path);
	} else if (path === appPaths.allLoans) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('div', 'Loans').click();
				cy.contains('All Loans').click();
				cy.contains('div', 'Loans').click();
			});
		cy.url().should('include', path);
	} else if (path === appPaths.editLoan) {
		cy.get('.simplebar-wrapper')
			.first()
			.within(() => {
				cy.contains('Loans').click({ force: true });
				cy.wait(8000); // we must wait because load list in Loans necessary time
				cy.contains('Edit Loan').click();
				cy.contains('Loans').click();
			});
		cy.url().should('include', path);
	} else if (path === appPaths.billing) {
		cy.get(`button[data-cy="avatar"]`).click({ force: true }); // dot'n delete "force" here!

		cy.get('a').contains('Billing').click();

		cy.url().should('include', path);
	} else if (path === appPaths.scheduledPayments) {
		cy.contains('Payments').click({ force: true });
		cy.contains(`a`, `Scheduled Payments`).click({ force: true });
		cy.contains('Payments').click({ force: true });

		cy.url().should('include', path);
	} else if (path === appPaths.profile) {
		cy.get(`button[data-cy="avatar"]`).click({ force: true }); // dot'n delete "force" here!

		cy.contains(`a`, `Profile`).click();
		cy.url().should('include', path);
	} else if (path === appPaths.addBorrowerPaymentMethod) {
		cy.contains(`a`, `Add Borrower Payment Method`).click();

		cy.url().should('include', path);
	} else if (path === appPaths.teamMembers) {
		cy.contains(`a`, `Team Members`).click();

		cy.url().should('include', path);
	} else if (path === appPaths.accountPreferences) {
		cy.get(`button[data-cy="avatar"]`).click({ force: true }); // dot'n delete "force" here!

		cy.get('a').contains('Account Preferences').click();

		cy.url().should('include', path);
	} else if (path === appPaths.paymentSharingSummary) {
		cy.contains('Payments').click();
		cy.contains('Payment Sharing').click();
		cy.contains('Payments').click({ force: true });
		cy.url().should('include', path);
	} else if (path === appPaths.addBorrowerAssit) {
		cy.contains('Borrower').click();
		cy.contains('div', 'Borrower Assist').click();
	} else {
		cy.log('Path navigation not yet configured');
	}
};

const exists = (selector, waitTime = 2000) => {
	cy.wait(waitTime);
	return cy.get('body').then(($body) => {
		const matches = [];
		for (const element of $body.find(selector)) {
			matches.push(element);
		}
		return matches.length > 0;
	});
};

const containsText = (selector, text, waitTime = 500) => {
	cy.wait(waitTime);
	return cy.get('body').then(($body) => {
		const matches = [];
		for (const element of $body.find(selector)) {
			if (element.textContent.includes(text)) {
				matches.push(element);
			}
		}
		return matches.length > 0;
	});
};

const randomString = ({ withSymb = true } = {}) => {
	let allChar = '';
	const defChar =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	const symbold = '+_.';

	allChar += defChar;

	if (withSymb) {
		allChar += symbold;
	}

	let result = '';
	const length = 10;

	for (let i = 0; i < length; i++) {
		result += allChar.charAt(Math.floor(Math.random() * allChar.length));
	}

	if (symbold.includes(result.at(-1))) {
		result = `${result.slice(0, -2)}${defChar.charAt(
			Math.floor(Math.random() * defChar.length)
		)}`;
	}

	return result;
};

const randomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const generatePassword = (minlength, caps, numbers, specialChars) => {
	let password = [];

	password = password
		.concat(
			Array(caps)
				.fill(0)
				.map(() => randomInt('A'.charCodeAt(), 'Z'.charCodeAt()))
		)
		.concat(
			Array(numbers)
				.fill(0)
				.map(() => randomInt('0'.charCodeAt(), '9'.charCodeAt()))
		)
		.concat(
			Array(specialChars)
				.fill(0)
				.map(() => randomInt('!'.charCodeAt(), '&'.charCodeAt()))
		);

	const lowers = minlength - caps - numbers - specialChars;
	if (lowers > 0) {
		password = password.concat(
			Array(lowers)
				.fill(0)
				.map(() => randomInt('a'.charCodeAt(), 'z'.charCodeAt()))
		);
	}
	const arrExcludes = [35, 38, 43, 47, 92]; //  35 - "#", 38 - "&"", 43 - "+", 47 - "/" 92 - "\""

	password
		.map((el) => (arrExcludes.includes(el) ? (el = 64) : el))
		.sort(() => Math.random() - 0.5);

	return String.fromCharCode(...password)
		.replaceAll('"', '@')
		.replaceAll("'", '@');
};

const copyObject = (object) => {
	//method will loose any Javascript types that have no equivalent in JSON
	return JSON.parse(JSON.stringify(object));

	//Could possibly use this:
	// Native deep cloning
	// There's now a JS standard called 'structured cloning', that works experimentally in Node 11 and later, will land in browsers, and which has polyfills for existing systems.

	// structuredClone(value)
	// If needed, loading the polyfill first:

	// import structuredClone from '@ungap/structured-clone';
	// See this answer for more details.
};

const interceptRequest = (path = '') => {
	return new Cypress.Promise((resolve, reject) => {
		const url = `${DEV_API_URL}${path}`;

		cy.intercept({ url }).as(path);

		cy.wait(`@${path}`).then((interception) => {
			resolve(interception);
		});
	});
};

const clearAllLocalData = () => {
	cy.clearAllCookies();
	cy.clearAllLocalStorage();
	cy.clearAllSessionStorage();

	lastLoggedInUser = '';
};

//Stops cypress from running any following tests when failure encountered.
const stopOnFirstFailure = (currentTest) => {
	if (
		currentTest.state === 'failed' &&
		currentTest.currentRetry() == currentTest._retries
	) {
		Cypress.runner.stop();
	}
};

const expectWindowAlert = ({
	text,
	trigger = () => {},
	callback = () => {},
}) => {
	let alertText;
	cy.on('window:alert', (tempAlertText) => {
		alertText = tempAlertText;
	});

	trigger();

	cy.waitUntil(() => alertText, {
		errorMsg: "window.alert wasn't called.",
		timeout: Cypress.config('defaultCommandTimeout'),
	}).then(() => {
		expect(alertText, 'Alert window content').to.contains(text);
		callback();
	});
};

const generateAccountNumber = (count) => {
	return Array(count)
		.fill(0)
		.map(() => randomInt('0', '9'))
		.join('');
};

const dwollaFillingFields = (arrSelect) => {
	arrSelect.forEach((el) => {
		'typeText' in el
			? cy
					.embeded(false, 'get', [el.select])
					.should('not.be.disabled')
					.clear()
					.type(el.typeText, { force: true })
			: 'typeButton' in el
			? cy.embeded(false, 'get', [el.select]).should('not.be.disabled').click()
			: cy
					.embeded(false, 'get', [el.select])
					.should('not.be.disabled')
					.select(el.optionText);
	});
};

const addOwners = ({
	isIAV = false,
	wait = 30000,
	isHasIndividual = false,
}) => {
	it(`Add Owners ${isIAV ? 'with IAV' : ''}`, () => {
		if (wait) cy.wait(wait);

		cy.reload();

		cy.url().should(
			'contain',
			'/dashboard/addPaymentAccount/addBeneficialOwner'
		);

		cy.get('dwolla-beneficial-owners').shadow().as('dwollaShadow');
		cy.get('@dwollaShadow')
			.get(`#dwolla-beneficial-owners`)
			.as('dwollaConteiner');

		cy.get(`@dwollaConteiner`)
			.first()
			.within(() => {
				if (isHasIndividual) {
					cy.get(`input#hasOwners[name='ownersRadio']`).first().click();
					cy.get('input#determine-owners-submit').click();

					cy.contains(`p`, `No owners have been added.`).should(`be.visible`);

					const arrSelect_dwalla_Add_Owners = [
						{
							select: selectors.dwollaForLenders_Add_Owners.firstNameInput,
							typeText: `example_firstName`,
						},
						{
							select: selectors.dwollaForLenders_Add_Owners.lastNameInput,
							typeText: `example_lastName_`,
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners.address1ControllerInput,
							typeText: 'Address 1',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners.address2ControllerInput,
							typeText: 'Address 2',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners.address3ControllerInput,
							typeText: 'Address 3',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners.countryControllerSelect,
							optionText: 'US',
						},
						{
							select: selectors.dwollaForLenders_Add_Owners.cityControllerInput,
							typeText: 'Kyiv',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners.stateControllerSelect,
							optionText: 'NY',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners.postalCodeControllerInput,
							typeText: '12345',
						},
						{
							select: selectors.dwollaForLenders_Add_Owners.ssnControllerInput,
							typeText: '000000000',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners
									.dateOfBirthControllerInput,
							typeText: '1998-05-31',
						},
						{
							select:
								selectors.dwollaForLenders_Add_Owners
									.dwollaBusinessVcrSubmitButton,
							typeButton: true,
						},
					];

					for (let index = 0; index < 2; index++) {
						cy.get('input#add-owner-document').click(); // "Add Owner"

						dwollaFillingFields(arrSelect_dwalla_Add_Owners);
					}

					// deleting
					cy.get(`input[value="Delete"]`).first().click();
					cy.get(`input#deleteOwners`).click();

					cy.wait(5000);

					cy.get(`input[value="Confirm"]`).click({
						force: true,
					});

					cy.get('input#hasOwners[name="certifyCorrectHasOwners"]').click();
					cy.get('input#hasOwners-certify-submit')
						.should(`not.be.disabled`)
						.click();

					cy.url().should('contain', appPaths.addPaymentAccount);
				} else {
					cy.get(`input#noOwners[name='ownersRadio']`).first().click();

					cy.get('input#determine-owners-submit').click();

					cy.get(`input#hasOwners[name='certifyControllersNoOwners']`).click();
					cy.get(`input#noOwners[name='certifyCorrectNoOwners']`).click();

					cy.get('input#noOwners-certify-submit').click();
				}
			});

		if (wait) cy.wait(wait);
	});
};

// special click for loan(sometimes simple click don't work)
const clickOnLoanName = (loanName) => {
	cy.contains('h6', loanName)
		.parent()
		.trigger('mouseover', { force: true })
		.wait(1000)
		.click({ force: true })
		.click({ force: true });
};

const formatMonth = (monthIndex) => {
	const months = {
		0: 'Jan',
		1: 'Feb',
		2: 'Mar',
		3: 'Apr',
		4: 'May',
		5: 'Jun',
		6: 'Jul',
		7: 'Aug',
		8: 'Sep',
		9: 'Oct',
		10: 'Nov',
		11: 'Dec',
	};

	const monthName = months[monthIndex];

	return monthName;
};

const fieldType = {
	select: 'select',
	input: 'input',
	dynamic: 'dynamic',
	date: 'date',
};

const getShortMonthNameByDate = (date) => {
	return date.toLocaleString('en-us', { month: 'short' });
};

const fillFiled = ({
	type,
	selector,
	value,
	content = '',
	textForPopUp = 'Ok',
}) => {
	if (type == fieldType.input) {
		cy.get(selector).should('not.be.disabled').clear().type(value);
	} else if (type == fieldType.select) {
		cy.get(selector).click();
		cy.get('li').contains(value).click();
	} else if (type == fieldType.date) {
		cy.contains(selector, content)
			.siblings()
			.children('input')
			.invoke('val')
			.then((currentDate) => {
				cy.log(`currentDate - ${currentDate}`);

				cy.contains(selector, content)
					.siblings()
					.children('input')
					.click({ force: true });

				function monthDiff(dateFrom, dateTo) {
					return (
						dateTo.getMonth() -
						dateFrom.getMonth() +
						12 * (dateTo.getFullYear() - dateFrom.getFullYear())
					);
				}
				const activeDate =
					currentDate === '' ? new Date() : new Date(currentDate);
				const dateValue = new Date(value);
				const months = monthDiff(dateValue, activeDate);

				let buttonSelector = months > 0 ? 'Previous month' : 'Next month';

				cy.get('div.MuiCalendarPicker-root')
					.first()
					.within(() => {
						cy.get(`button[aria-label="${buttonSelector}"]`).as(
							'monthChangeButton'
						);

						for (let i = 0; i < Math.abs(months); i++) {
							cy.get('@monthChangeButton').click();
						}

						cy.wait(100);
						if (dateValue.getDate() < 29) {
							cy.contains('button', dateValue.getDate()).click();
						} else {
							const newDate = dateValue.getDate() - 3;
							cy.contains('button', newDate).click();
						}
					});

				cy.contains('button', new RegExp('OK', 'g')).click();
			});
	} else if (type == fieldType.dynamic) {
		const fieldCount = value.length;
		for (let i = 0; i < fieldCount; i++) {
			if (i > 0) {
				cy.contains('h5', 'Monthly Fees')
					.parent()
					.parent()
					.parent()
					.within(() => {
						cy.get(`button svg[style="color: green;"]`).click();
					});
			}

			cy.get(`input[id="fee-name-${i + 1}"]`)
				.clear()
				.type(value[i].name);
			cy.get(`input[id="Charge ${i + 1}"]`)
				.clear()
				.type(value[i].charge);
		}
	} else if (type == fieldType.tags) {
		fieldType.tags.map((tag) => {
			cy.contains('input#tags').type(tag);
		});
	} else if (type == fieldType.ballonDate) {
		const curentYear = value.slice(-4);

		const getBallonDate = new Date(value);
		const nextMonthName = getShortMonthNameByDate(getBallonDate);

		cy.contains(selector, content)
			.siblings()
			.children('input')
			.click({ force: true });

		const regexOk = new RegExp('Ok', 'gi');
		cy.contains('button', `${curentYear}`).click({ force: true });
		cy.contains('button', `${nextMonthName}`).click({ force: true });
		cy.contains('button', regexOk).click({ force: true });

		// 	cy.contains('button', 'Remove Balloon Payment').click({ force: true });
		// 	closePopup({ wait: 1000, text: `${textForPopUp}` });
		// 	cy.contains('h6', content)
		// 	.parent()
		// 	.parent()
		// 	.contains('p', '-')
		// need for delete ballon date
	}
};

const checkFiled = ({ type, selector, value, content = '' }) => {
	if (type == fieldType.input) {
		cy.get(selector).should('have.value', `${value}`);
	} else if (type == fieldType.select) {
		cy.get(selector).click();
		cy.get('li').contains(value).click();
	} else if (type == fieldType.date) {
		cy.contains(selector, content)
			.siblings()
			.children('input')
			.invoke('val')
			.then((currentDate) => {
				cy.log(`currentDate - ${currentDate}`);

				cy.contains(selector, content).siblings().children('input').click();

				function monthDiff(dateFrom, dateTo) {
					return (
						dateTo.getMonth() -
						dateFrom.getMonth() +
						12 * (dateTo.getFullYear() - dateFrom.getFullYear())
					);
				}
				const activeDate =
					currentDate === '' ? new Date() : new Date(currentDate);
				const dateValue = new Date(value);
				const months = monthDiff(dateValue, activeDate);

				let buttonSelector = months > 0 ? 'Previous month' : 'Next month';

				cy.get('div.MuiCalendarPicker-root')
					.first()
					.within(() => {
						cy.get(`button[aria-label="${buttonSelector}"]`).as(
							'monthChangeButton'
						);

						for (let i = 0; i < Math.abs(months); i++) {
							cy.get('@monthChangeButton').click();
						}

						cy.wait(100);
						cy.contains('button', dateValue.getDate()).click();
					});

				cy.contains('button', new RegExp('OK', 'g')).click();
			});
	} else if (type == fieldType.dynamic) {
		const fieldCount = value.length;
		for (let i = 0; i < fieldCount; i++) {
			if (i > 0) {
				cy.contains('h5', 'Monthly Fees')
					.parent()
					.parent()
					.parent()
					.within(() => {
						cy.get(`button svg[style="color: green;"]`).click();
					});
			}

			cy.get(`input[id="fee-name-${i + 1}"]`).should(
				'have.value',
				`${value[i].name}`
			);

			cy.get(`input[id="Charge ${i + 1}"]`).should(
				'have.value',
				`${value[i].charge}`
			);
		}
	} else if (type == fieldType.ballonDate) {
		const curentYear = +value.slice(-4) + 1;
		const getBallonDate = new Date(value);
		const nextMonthName = getShortMonthNameByDate(getBallonDate);
		cy.contains(selector, content)
			.siblings()
			.children('input')
			.click({ force: true });
		cy.contains('button', `${curentYear}`).click({ force: true });
		cy.contains('button', `${nextMonthName}`).click({ force: true });

		closePopup({ wait: 1000, text: 'Ok' });
	}
};

const loanForm = {
	state: { type: fieldType.select, selector: 'div#state' },
	county: { type: fieldType.input, selector: 'input#county' },
	parcelNumbers: { type: fieldType.input, selector: 'input#parcelNumbers' },
	name: { type: fieldType.input, selector: 'input#name' },
	salePrice: { type: fieldType.input, selector: 'input#salePrice' },
	financedAmount: { type: fieldType.input, selector: 'input#financedAmount' },
	interestRate: { type: fieldType.input, selector: 'input#interestRate' },
	daysInterestMethod: {
		type: fieldType.select,
		selector: 'div#daysInterestMethod',
	},
	numberOfPayments: {
		type: fieldType.input,
		selector: 'input#numberOfPayments',
	},
	daysBeforeDefault: { type: fieldType.input, selector: 'input#defaultDays' },
	interestStartDate: {
		type: fieldType.date,
		selector: 'label',
		content: 'Interest Start Date',
	},
	paymentStartDate: {
		type: fieldType.date,
		selector: 'label',
		content: 'Payment Start Date',
	},
	loanOriginationDate: {
		type: fieldType.date,
		selector: 'label',
		content: 'Loan Origination Date',
	},
	ballonPayment: {
		type: fieldType.ballonDate,
		selector: 'label',
		content: 'Balloon Payment Date',
	},
	lateFeeType: { type: fieldType.select, selector: 'div#lateFeeType' },
	lateFeeAmountA: { type: fieldType.input, selector: 'input#amountA' },
	lateFeeAmountP: { type: fieldType.input, selector: 'input#amountP' },
	gracePeriod: { type: fieldType.input, selector: 'input#gracePeriod' },
	achFlatFee: { type: fieldType.input, selector: 'input#achFlat' },
	achPercentage: { type: fieldType.input, selector: 'input#achPercentage' },
	creditCardFlatFee: {
		type: fieldType.input,
		selector: 'input#creditcardFlat',
	},
	creditCardPercentage: {
		type: fieldType.input,
		selector: 'input#creditcardPercentage',
	},
	additionalFees: { type: fieldType.dynamic },
};

const formatterNum = new Intl.NumberFormat('en-US', {
	// for use "formatter.format(2500);" // '$2,500.00'
	style: 'currency',
	currency: 'USD',

	// These options are needed to round to whole numbers if that's what you want.
	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const acceptPopup = ({ role }) => {
	// Roles can be: Borrower, Lender, Partner, Team Member

	containsText(`p`, `Email invitation sent to the ${role}!`).then((result) => {
		if (result)
			cy.contains(`p`, `Email invitation sent to the ${role}!`)
				.parent()
				.parent()
				.first()
				.within(() => {
					cy.contains(`OK`).click();
				});
	});
};

const differenceDays = (
	eventDay,
	neededDifference,
	currentDate = Date.now()
) => {
	const eventDaytMs = new Date(eventDay).getTime();
	console.log('eventDaytMs', eventDaytMs);
	const diffDaysMs = currentDate - eventDaytMs;
	console.log('diffDaysMs', diffDaysMs);
	const days = diffDaysMs / (1000 * 60 * 60 * 24);
	console.log('days', days);

	return days > neededDifference;
};

const fillPlaid = ({ bankName, testDataForBank, isSaving, testBankName }) => {
	cy.frameLoaded('[title="Plaid Link"]');

	cy.iframe('[title="Plaid Link"]').as('plaid');

	cy.get('@plaid').contains('span', 'Continue').parent().click();

	cy.get('@plaid')
		.find(`button[aria-label="${bankName}"]`)
		.parents('li')
		.click();

	let loginForBankAcc;
	let passwordForBankAcc;
	switch (bankName) {
		case `Regions Bank`:
			loginForBankAcc = `Online ID`;
			passwordForBankAcc = `Password`;
			break;
		case `TD Bank`:
			loginForBankAcc = `User Name`;
			passwordForBankAcc = `Password`;
			break;
		case `Navy Federal Credit Union`:
			loginForBankAcc = `Username`;
			passwordForBankAcc = `Password`;
			break;
		case `Citizens Bank`:
			loginForBankAcc = `User ID`;
			passwordForBankAcc = `Password`;
			break;
		case `Huntington Bank`:
			loginForBankAcc = `Username`;
			passwordForBankAcc = `Password`;
			break;
		case `Wealthfront`:
			loginForBankAcc = `Email`;
			passwordForBankAcc = `App-Specific Password`;
			break;
		case `Betterment`:
			loginForBankAcc = `E-Mail`;
			passwordForBankAcc = `App Password`;
			break;
		case `Stash`:
			loginForBankAcc = `Email`;
			passwordForBankAcc = `Password`;
			break;

		default:
			break;
	}

	// login and password hardcode from https://plaid.com/docs/sandbox/test-credentials/
	cy.get('@plaid')
		.contains('label', `${loginForBankAcc}`)
		.parent()
		.within(() => {
			cy.get('input').clear().type(testDataForBank.login);
		});

	cy.get('@plaid')
		.contains('label', `${passwordForBankAcc}`)
		.parent()
		.within(() => {
			cy.get('input').clear().type(testDataForBank.password);
		});

	cy.get('@plaid').contains('span', 'Submit').parents('button').click();

	const plaidType = isSaving ? `Plaid Saving` : `Plaid Checking`;
	cy.get('@plaid').contains('div', `${plaidType}`).parents('li').click();

	cy.get('@plaid').contains('span', 'Continue').parent().click();

	cy.get('@plaid').contains('span', 'Continue').parent().click();

	cy.get('input#bankName').clear().type(`${testBankName}`);

	cy.contains('Connect a bank account').click({ force: true });

	closePopup({ text: 'Ok' });
};

const generateBankName = ({ bankName }) => {
	return `BankName_${bankName.replaceAll(` `, `_`)}_${randomString({
		withSymb: false,
	})}`;
};

const fillFullNameEmail = ({ user, emailSelect }) => {
	cy.wait(5000);

	cy.get(selectors.pageSignUp.firstNameInput)
		.should('not.be.disabled')
		.clear()
		.type(user.firstName);

	cy.get(selectors.pageSignUp.lastNameInput)
		.should('not.be.disabled')
		.clear()
		.type(user.lastName);

	if (emailSelect) {
		cy.get(`${emailSelect}`).should('not.be.disabled').clear().type(user.email);
	}
};

const linkWithAccountNumbers = ({ bankObj }) => {
	cy.frameLoaded('[title="Plaid Link"]');

	cy.iframe('[title="Plaid Link"]').as('paymentFrame');

	cy.get('@paymentFrame')
		.first()
		.within(() => {
			cy.contains('Continue').click();
			cy.contains('Continue').click();

			cy.contains('span', 'Link with account numbers')
				.parents('button')
				.click();

			// Step 1
			cy.get('input#device-input').clear().type(bankObj.routingNumber);
			cy.contains('Continue').click();

			// Step 2
			cy.get('input#account-number-input').clear().type(bankObj.accountNumber);
			cy.get('input#account-number-confirmation')
				.clear()
				.type(bankObj.accountNumber);
			cy.contains('Continue').click();

			// Step 3 (Name must be the same as on the bank account)
			// cy.get('input#name-input').clear().type(bankObj.username);
			cy.get('input#name-input').clear().type('Yevh');
			cy.contains('Continue').click();

			// Step 4 (Select account type)
			cy.contains('Continue').click();
			cy.contains('span', 'Authorize').parents('button').click({ force: true });

			cy.contains('Continue').click();
		});

	cy.wait(5000);

	cy.get('input#bankName')
		.should('not.be.disabled')
		.clear()
		.type(`Bank_${bankObj.bankName}`);

	cy.contains('Connect a bank account').click({ force: true });
};

export default {
	logout,
	login,
	signup,
	navigate,
	exists,
	containsText,
	randomString,
	generatePassword,
	copyObject,
	increaseTimeout,
	interceptRequest,
	clearAllLocalData,
	stopOnFirstFailure,
	expectWindowAlert,
	generateAccountNumber,
	dwollaFillingFields,
	closePopup,
	addOwners,
	clickOnLoanName,
	formatMonth,
	fillFiled,
	fieldType,
	checkFiled,
	loanForm,
	formatterNum,
	acceptPopup,
	differenceDays,
	fillPlaid,
	generateBankName,
	fillFullNameEmail,
	linkWithAccountNumbers,
};
