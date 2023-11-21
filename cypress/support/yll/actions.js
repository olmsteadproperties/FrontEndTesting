import { marketingPaths, appPaths } from './paths';

import {
	login,
	logout,
	navigate,
	containsText,
	randomString,
	generatePassword,
	copyObject,
	interceptRequest,
	signup,
	exists,
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
} from './util';

import bankAccounts from './bankAccounts';

import selectors from './selectors';

import { getAccount, saveAccount } from './generatedAccounts';

import path from 'path';
import 'cypress-wait-until';
import 'cypress-iframe';

const testDataForBank = {
	login: bankAccounts.successPlaid.username,
	password: bankAccounts.successPlaid.password,
};

const DEV_API_URL = Cypress.env('devApiUrl');
const PROD_APP_URL = Cypress.env('prodAppUrl');
const DEV_APP_URL = Cypress.env('devAppUrl');
const DEV_MARKETING_SITE_URL = Cypress.env('devMarketingSiteUrl');

let loansToCleanup = [];

const createNewLoan = ({
	lenderAccount,
	loan,
	isDraft = false,
	checkLimit = false,
	isBallonPaymnent = false,
	textForPopUp,
}) => {
	loansToCleanup.push({ lenderAccount, loan });

	describe(`Create New Loan  ${loan.name} for lender ${lenderAccount.email}`, () => {
		it(`Should login with lender: ${lenderAccount.email}`, () => {
			getAccount(lenderAccount.email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.addNewLoan} using the UI`, () => {
			exists('Notice', 5000).then(
				($isOneMoreLoan) => $isOneMoreLoan && closePopup({ text: 'Ok' })
			);

			navigate(appPaths.addNewLoan, 2000); // need time because Dwoll redirect slow to addPayment page
		});

		it(`Should fill out form fields`, () => {
			if (!isBallonPaymnent) {
				delete loan.ballonPayment;
			}

			for (let field in loan) {
				cy.log(`Filling in field: **${field}**`);
				let formField = loanForm[field];
				let fieldValue = loan[field];

				fillFiled({
					type: formField.type,
					selector: formField.selector,
					value: fieldValue,
					content: formField.content,
					textForPopUp,
					loan,
				});
			}
		});

		it('Should submit the new loan form', () => {
			if (isDraft) {
				cy.contains('button', 'Save as Draft').click();
				cy.wait(6000);
				cy.reload();
			} else if (checkLimit) {
				cy.contains('button', 'Create Loan').click();

				cy.contains(`h2`, `Warning !`)
					.parent()
					.first()
					.within(() => {
						cy.contains(
							`p`,
							`Active Loan Limit Reached. Please Upgrade your Plan Here or remove unnecessary Loans.`
						);

						cy.contains(`button`, `Back`).click();
					});
			} else {
				cy.contains('button', 'Create Loan').click();
				closePopup({ text: 'Ok' });
			}
		});
	});
};

const editLoan = ({
	changeSection,
	isDisabled = false,
	dataForUpdate,
	textForPopUp = 'Ok',
	isUpdateField = false,
}) => {
	describe('Should edit loan', () => {
		it('Should nav to Edit Loan page', () => {
			navigate(appPaths.editLoan, 2000);
		});

		it(`Changes "${changeSection}" section.\nDisabled: ${isDisabled}`, () => {
			const regexUpdate = new RegExp('Update$', 'g');

			const changeSectionFn = (status) => {
				cy.log(`Chack section to ${status}`);
				cy.contains('p', changeSection)
					.parent()
					.parent()
					.parent()
					.first()
					.within(() => {
						if (status.includes('enabled')) {
							cy.get('button').click({ force: true });
						} else {
							cy.get('button').should(`be.${status}`);
						}
					});
			};

			if (isDisabled === `first_step_disabled`) {
				changeSectionFn(`disabled`);
			} else if (isDisabled === `second_step_disabled`) {
				changeSectionFn(`enabled`);

				switch (changeSection) {
					case `Payments`:
						const listKeysPayments = [
							`salePrice`,
							`loanOriginationDate`,
							'ballonPayment',
						];

						for (let field in dataForUpdate) {
							if (!listKeysPayments.includes(field)) {
								continue;
							}

							cy.log(`Checking in field: **${field}**`);
							let formField = loanForm[field];
							let fieldValue = dataForUpdate[field];

							checkFiled({
								type: formField.type,
								selector: formField.selector,
								value: fieldValue,
								content: formField.content,
							});
						}

						break;

					case `Interest`:
						const listKeysInterest = [`interestStartDate`];
						for (let field in dataForUpdate) {
							if (!listKeysInterest.includes(field)) {
								continue;
							}

							cy.log(`Checking in field: **${field}**`);
							let formField = loanForm[field];
							let fieldValue = dataForUpdate[field];

							checkFiled({
								type: formField.type,
								selector: formField.selector,
								value: fieldValue,
								content: formField.content,
							});
						}

						break;

					case `Miscellaneous`:
						const listKeysMiscellaneous = [
							`state`,
							`county`,
							`name`,
							`daysBeforeDefault`,
							`parcelNumbers`,
						];

						for (let field in dataForUpdate) {
							if (!listKeysMiscellaneous.includes(field)) {
								continue;
							}

							cy.log(`Checking in field: **${field}**`);
							let formField = loanForm[field];
							let fieldValue = dataForUpdate[field];

							checkFiled({
								type: formField.type,
								selector: formField.selector,
								value: fieldValue,
								content: formField.content,
							});
						}

						cy.get('button').contains(regexUpdate).should('be.disabled');

						break;
					default:
						break;
				}
			} else {
				changeSectionFn(`enabled`);

				switch (changeSection) {
					case `Payments`:
						const listKeysPayments = [
							`salePrice`,
							`loanOriginationDate`,
							'ballonPayment',
						];

						for (let field in dataForUpdate) {
							if (!listKeysPayments.includes(field)) {
								continue;
							}

							cy.log(`Filling in field: **${field}**`);
							let formField = loanForm[field];
							let fieldValue = dataForUpdate[field];

							fillFiled({
								type: formField.type,
								selector: formField.selector,
								value: fieldValue,
								content: formField.content,
								textForPopUp,
							});
						}
						break;
					case `Interest`:
						const listKeysInterest = [`interestStartDate`];
						for (let field in dataForUpdate) {
							if (!listKeysInterest.includes(field)) {
								continue;
							}

							cy.log(`Filling in field: **${field}**`);
							let formField = loanForm[field];
							let fieldValue = dataForUpdate[field];

							fillFiled({
								type: formField.type,
								selector: formField.selector,
								value: fieldValue,
								content: formField.content,
							});
						}
						break;
					case `Miscellaneous`:
						const listKeysMiscellaneous = [
							`state`,
							`county`,
							`name`,
							`daysBeforeDefault`,
							`parcelNumbers`,
						];

						for (let field in dataForUpdate) {
							if (!listKeysMiscellaneous.includes(field)) {
								continue;
							}
							if ([`name`].includes(field)) {
								dataForUpdate.name = `${dataForUpdate.name}_updated`;
							}

							cy.log(`Filling in field: **${field}**`);
							let formField = loanForm[field];
							let fieldValue = dataForUpdate[field];

							fillFiled({
								type: formField.type,
								selector: formField.selector,
								value: fieldValue,
								content: formField.content,
							});
						}
						break;
					default:
						break;
				}
				cy.get('button').contains(regexUpdate).click();

				closePopup({ text: 'Ok' });
			}

			if (isUpdateField) {
				cy.get('button').contains(regexUpdate).click();

				closePopup({ text: 'Ok' });
			}
		});
	});
};

// we don't use it now (was error on delete second loan)
const cleanUpLoans = ({ field }) => {
	describe(`Delete loans created in this run.`, () => {
		for (let i = loansToCleanup.length - 1; i >= 0; i--) {
			const { lenderAccount, loan } = loansToCleanup[i];

			it(`Should login with lender: ${lenderAccount.email}`, () => {
				getAccount(lenderAccount.email).then((foundAccount) => {
					expect(foundAccount).to.have.property('password');
					expect(foundAccount.password).not.to.be.empty;

					login({ account: foundAccount });
				});
			});

			it(`Should nav to ${appPaths.editLoan} using the UI`, () => {
				closePopup({ wait: 2500 });

				navigate(appPaths.editLoan, 3000);
			});

			it(`Select the loan ${loan.name} and delete it`, () => {
				exists('div.MuiSelect-select').then(($isOneMoreLoan) => {
					if ($isOneMoreLoan) {
						cy.get('div.MuiSelect-select').click();
						cy.get('p').contains(loan.name).click({ force: true });
					}
				});

				cy.contains('button', 'Delete Loan').click();

				let windowAlertComplete = false;
				cy.contains('h2#alert-dialog-title', 'Warning!')
					.parent()
					.first()
					.within(() => {
						cy.get('input#loanStatus').clear().type('Deleted');

						cy.contains('button', 'Delete').should('not.be.disabled').click();
						windowAlertComplete = true;
					});

				cy.waitUntil(() => windowAlertComplete).then(() => {
					cy.reload();
				});
			});
		}
	});
};

const deleteLoanField = ({ field, selector, content, buttonText, key }) => {
	describe(`Delete loan field`, () => {
		it('Should nav to Edit Loan page', () => {
			navigate(appPaths.editLoan);
		});

		it('Should select load section', () => {
			switch (key) {
				case 'ballonPayment':
					cy.contains('p', field)
						.parent()
						.parent()
						.first()
						.within(() => {
							cy.get('button').click();
						});

					cy.contains(selector, content)
						.siblings()
						.children('input')
						.click({ force: true });

					cy.contains('button', buttonText).click();
					closePopup({ wait: 1000, text: 'Ok' });
					cy.contains('h6', content).parent().parent();
					break;

				default:
					break;
			}
		});
	});
};

const deleteLoan = ({ lenderEmail, loanName }) => {
	describe(`Delete Loan ${loanName} for lender ${lenderEmail}`, () => {
		it(`Should login with lender: ${lenderEmail}`, () => {
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount, force: true });
			});
		});

		it(`Should nav to ${appPaths.editLoan} using the UI`, () => {
			navigate(appPaths.editLoan, 2500);
		});

		it(`Select the loan ${loanName} and delete it`, () => {
			exists('div.MuiSelect-select').then(($isOneMoreLoan) => {
				if ($isOneMoreLoan) {
					cy.get('div.MuiSelect-select').click();
					cy.contains('p', loanName).click({ force: true });
				}
			});

			cy.contains('button', 'Delete Loan').click();

			cy.contains('h2#alert-dialog-title', 'Warning!')
				.parent()
				.first()
				.within(() => {
					cy.get('input#loanStatus').clear().type('Deleted');

					cy.contains('button', 'Delete').should('not.be.disabled').click();
				});
		});
	});
};

const deleteAllLoans = ({ email = '' }) => {
	describe(`Delete all loans for lender ${email}`, () => {
		let allLoans;
		let bearerToken;
		let startLoanCount = 0;

		it(`Should login with lender: ${email}`, () => {
			cy.wait(1000);
			cy.reload();
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount, force: true });
			});

			interceptRequest('/users?subId=*').then(({ id, request, response }) => {
				allLoans = Object.values(response.body.Loans);
				bearerToken = request.headers.authorization.replace('Bearer ', '');
				startLoanCount = allLoans.length;
			});

			cy.waitUntil(() => !!allLoans && !!bearerToken, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should delete loans via post requests (${allLoans})`, () => {
			cy.log(`Preparing to delete ${startLoanCount} loans.`);

			let loansDeleted = 0;
			let activeRequests = 0;
			for (let loanId of allLoans) {
				let method = 'POST';
				let url = `${DEV_API_URL}/loans`;
				let body = {
					loanId: loanId,
					updateLoanStatus: {
						loanStatus: 'Deleted',
					},
				};
				let auth = {
					bearer: bearerToken,
				};
				activeRequests++;
				cy.request({
					method,
					url,
					body,
					auth,
				}).then((response) => {
					expect(response.status).to.eq(200);
					loansDeleted++;
					activeRequests--;
				});
			}

			cy.waitUntil(() => activeRequests == 0, {
				timeout: Cypress.config('defaultCommandTimeout'),
			}).then(() => {
				expect(loansDeleted, 'Loans deleted').to.eq(startLoanCount);
			});
		});

		it(`Should log in again and confirm there are no loans for this lender.`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount, force: true });
			});

			interceptRequest('/users?subId=*').then(({ id, request, response }) => {
				allLoans = Object.values(response.body.Loans);

				expect(allLoans.length, 'Loans found').to.eq(0);
			});
		});
	});
};

// not use but in future it useful
const deletePaymentMethod = ({ email = '' }) => {
	describe(`Delete Payment Method for ${email}`, () => {
		it(`Login: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
			closePopup({ wait: 2000 });
			navigate(appPaths.paymentMethods);
			closePopup({ wait: 2000 });
		});

		it('Get and delete bank if exist', () => {
			containsText('td', 'No payment systems have been added.').then(
				($isExist) => {
					if (!$isExist) {
						cy.get('tbody').children('tr').first().as('bank');
						cy.get('@bank').get('td').children('button').click();

						cy.contains('p', 'Delete').as('pDelete');
					}
				}
			);

			cy.get('@pDelete').click();
			closePopup({ text: 'Ok' });
		});
	});
};

// Workaround to slowness of addBorrower ui. Now we not use it
const addBorrowerToLoanDetails = ({
	borrowerAccount,
	lenderAccount,
	loanName,
}) => {
	describe(`Add Borrower ${borrowerAccount.email} to Loan ${loanName} via Loan Details Page`, () => {
		it(`Should login with lender: ${lenderAccount.email}`, () => {
			getAccount(lenderAccount.email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Should search for loan by name`, () => {
			cy.get('svg.MuiCircularProgress-svg').should('not.exist');
			cy.get('input[placeholder="Search Property..."').clear().type(loanName);
			cy.get('svg.MuiCircularProgress-svg').should('not.exist');
			cy.contains('h6', loanName)
				.parent()
				.click({ waitForAnimations: true, multiple: true }); //TODO: not working currently.
			cy.contains('p', 'Add Borrower').parent().click();
		});

		it(`Should fill in borrower details`, () => {
			fillFullNameEmail({
				user: borrowerAccount,
				emailSelect: selectors.pageSignUp.userEmailInput,
			});
		});

		it(`Should click submit button and get message "User created successfully"`, () => {
			cy.contains('button', 'Submit').should('not.be.disabled').click();
		});

		it(`Should save account details for testing`, () => {
			saveAccount(borrowerAccount);
		});
	});
};

const duplicate = `_Duplicate`;
// Adds borrower to loan via "Loans > "Add User to Loan". This method can get slow when adding many loans to a lender. To avoid
// this slowness adding the user from the loan details page is a suitable workaround. See addBorrowerToLoanDetails.
const addBorrower = ({
	borrowerAccount,
	lenderEmail = '',
	loanName,
	withAddress = false,
}) => {
	describe(`Add Borrower ${borrowerAccount.email} to Loan ${loanName}`, () => {
		it(`Should login with lender: ${lenderEmail}`, () => {
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		let borrower;
		it(`Should get information with borrower: ${borrowerAccount.email}`, () => {
			getAccount(borrowerAccount.email).then((foundAccount) => {
				if (foundAccount) {
					borrower = foundAccount;
				} else {
					borrower = borrowerAccount;
				}
			});

			cy.waitUntil(() => borrower, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.loansAddUser} using the UI`, () => {
			cy.wait(5000);
			cy.reload();

			navigate(appPaths.loansAddUser);
		});

		it(`Should have loan "${loanName}" under account ${lenderEmail}`, () => {
			cy.contains(loanName).should('have.length', 1);

			containsText('h6', `${loanName}`).then(($isExist) => {
				if ($isExist) {
					cy.contains('h6', `${loanName}`).click();
				}
			});
		});

		it(`Should fill in borrower details`, () => {
			fillFullNameEmail({
				user: borrower,
				emailSelect: selectors.pageSignUp.userEmailInput,
			});
		});

		if (withAddress) {
			it(`Should fill in borrower address`, () => {
				cy.get('input#street1').clear().type(borrower.street1);
				cy.get('input#street2').clear().type(borrower.street2);

				cy.get('div#state').click();
				cy.get('li[data-value="NY"]').click();

				cy.get('input#city').clear().type(borrower.city);
				cy.get('input#zipcode').clear().type(borrower.zipcode);
			});
		}

		it(`Should click submit button and get message "User created successfully"`, () => {
			cy.contains('button', 'Submit').should('not.be.disabled').click();
			acceptPopup({ role: `Borrower` });
		});

		it(`Should save account details for testing`, () => {
			let loans = borrower.loans;
			loans = typeof loans !== 'undefined' && Array.isArray(loans) ? loans : [];
			loans.push(loanName);
			borrower.loans = loans;

			saveAccount(borrower);
		});
	});
};

const acceptEmailInvite = ({ email = '', shouldHasLength = 0 } = {}) => {
	describe(`Accept email invite to borrower: ${email}`, () => {
		let account;
		it('Should find account with password and login', () => {
			getAccount(email).then((foundAccount) => {
				account = foundAccount;
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});
		it(`Logout any account`, () => {
			logout();
		});

		let googleApiToken;
		it(`Should get googleApiToken using gmail API`, () => {
			cy.log('Logging in to Google Account');
			cy.request({
				method: 'POST',
				url: 'https://www.googleapis.com/oauth2/v4/token',
				body: {
					grant_type: 'refresh_token',
					client_id: Cypress.env('googleClientId'),
					client_secret: Cypress.env('googleClientSecret'),
					refresh_token: Cypress.env('googleRefreshToken'),
				},
			}).then(({ body }) => {
				googleApiToken = body;
			});

			cy.waitUntil(() => googleApiToken, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		let latestMessages;
		it(`Should get latest message from gmail inbox`, () => {
			cy.log('Give some time for email to be recieved.');
			cy.wait(4000); // Give some time for email to be recieved.

			const { access_token } = googleApiToken;

			const content = 'Your Land Loans Temporary Password';
			const newer_than = '1h';
			const emailSender = Cypress.env('appEmailSender');
			const emailSubject = 'Your Land Loans Temporary Password';
			const label = 'all'; // all, spam

			const query = encodeURIComponent(
				`${content} newer_than:${newer_than} from:${emailSender} to:${account.email} subject:${emailSubject} label:${label}`
			);

			cy.request({
				method: 'GET',
				url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env(
					'googleEmail'
				)}/messages?q=${query}`,
				headers: { Authorization: `Bearer ${access_token}` },
			}).then((response) => {
				latestMessages = response.body.messages; // sometimes we get more then 1 message
			});

			cy.waitUntil(() => latestMessages, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		let emailContents = [];
		let emailContent;
		it(`Get email content for latest message from gmail API`, () => {
			const { access_token } = googleApiToken;

			for (let i = 0; i < latestMessages.length; i++) {
				cy.request({
					method: 'GET',
					url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env(
						'googleEmail'
					)}/messages/${latestMessages[i].id}?format=full`,
					headers: { Authorization: `Bearer ${access_token}` },
				}).then((response) => {
					let payload = response.body.payload;
					if (typeof payload.parts != 'undefined') {
						payload = payload.parts[0];
					}

					const encodedEmailContent = payload.body.data;

					cy.log('encodedEmailContent', encodedEmailContent);
					if (encodedEmailContent) {
						const uint8array = Buffer.from(encodedEmailContent, 'base64');

						const encodedPassword = encodeURIComponent(
							new TextDecoder().decode(uint8array)
						);
						const pass = decodeURIComponent(encodedPassword);

						emailContents.push(pass);
					}
				});
			}

			cy.waitUntil(() => emailContents.length > 0, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		let passwordResetLink;
		it('Should parse email, password, and reset link, then use it to update local cypress test account info.', () => {
			emailContent = emailContents.filter((letter) =>
				letter.includes('Username:')
			)[0];

			if (!!shouldHasLength) {
				expect(emailContents).have.length(shouldHasLength);
			}

			emailContent = emailContent
				.replace(/(\r\n|\n|\r)/gm, '') //Remove all types of newline characters.
				.replace(/&gt;/g, '>') //sanatize
				.replace(/&lt;/g, '<')
				.replace(/&quot;/g, '"')
				.replace(/&apos;/g, "'")
				.replace(/&amp;/g, '&');

			const usernamePattern = 'Username: ';
			const passwordPattern = 'Temporary Password: ';
			const linkPattern = 'Please click         <a href=';

			const tempPassword = emailContent
				.substring(
					emailContent.match(passwordPattern).index + passwordPattern.length
				)
				.split(' ')[0];
			const userEmail = emailContent
				.substring(
					emailContent.match(usernamePattern).index + usernamePattern.length
				)
				.split(' ')[0];

			passwordResetLink = emailContent
				.substring(emailContent.match(linkPattern).index + linkPattern.length)
				.split(' ')[0]
				.replaceAll('"', '');

			cy.log('Collecting user details from email.');
			const encodedtempPassword = encodeURIComponent(tempPassword);
			cy.log('Default pass:', tempPassword);
			cy.log(
				'DecodeURIComponent pass:',
				decodeURIComponent(encodedtempPassword)
			);
			cy.log(passwordResetLink);

			expect(
				account.email.toLowerCase(),
				'Invite email is for the account requested.'
			).to.equal(userEmail.toLowerCase()); //This expects that the last email invited is trying to accept. We can check thorugh all emails instead later if needed.

			account.password = decodeURIComponent(encodedtempPassword);
			account.dateUpdated = new Date().toString();

			saveAccount(account);
		});

		let devUrl;
		it(`Should forward to dev password reset link`, () => {
			cy.visit(passwordResetLink);

			cy.url().then((url) => {
				getAccount(account.email).then((foundAccount) => {
					devUrl = url;

					if (!devUrl.includes('dev.')) {
						devUrl = devUrl.replace(`${PROD_APP_URL}`, `${DEV_APP_URL}`);
						cy.visit(devUrl);
					}
				});
			});
			cy.waitUntil(() => devUrl, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it('Should prompt user for password reset', () => {
			exists(selectors.pageSignIn.passwordInput).then(($isExist) => {
				if ($isExist) {
					getAccount(account.email).then((foundAccount) => {
						expect(foundAccount).to.have.property('password');
						expect(foundAccount.password).not.to.be.empty;

						login({ account: foundAccount, loginUrl: devUrl });
					});
				}
			});

			cy.get(selectors.passwordReset.newPasswordInput).should('have.length', 1);

			cy.contains('New Password Required').should('have.length', 1);
			cy.contains('button', 'Reset Password').should('have.length', 1);
		});

		it('Should successfully reset password with autogenerated password', () => {
			const passwordReset = generatePassword(12, 1, 1, 1);

			cy.log(`New password: ${passwordReset}`);

			cy.get(selectors.passwordReset.newPasswordInput)
				.clear()
				.type(passwordReset);

			cy.get(selectors.passwordReset.confirmNewPasswordInput)
				.clear()
				.type(passwordReset);

			cy.contains('button', 'Reset Password').click({ force: true });

			account.password = passwordReset;
			account.dateUpdated = new Date().toString();

			saveAccount(account);

			cy.log(`New borrower created:`);
			cy.log(`\temail: ${account.email}`);
			cy.log(`\tpassword: ${account.password}`);

			cy.wait(2000);
		});

		it('Should login with lender account', () => {
			getAccount(account.email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount, force: true });
			});
		});

		it('Should accept popup messages', () => {
			let welcomeMessageClosed = false;
			let termsAccepted = false;

			containsText('h2', 'Terms Of Services and Privacy Policy', 3000).then(
				(result) => {
					if (result) {
						cy.get('[data-testid="CheckBoxOutlineBlankIcon"]').click({
							force: true,
						});
						cy.contains('button', 'Submit').click({ force: true });
					}
					termsAccepted = true;
				}
			);

			// sometimes popup appears
			closePopup({ wait: 3000 });

			containsText('h2', 'Welcome to Your Land Loans!', 3000).then((result) => {
				if (result) {
					closePopup({ wait: 2500 });
				}
				welcomeMessageClosed = true;
			});

			cy.waitUntil(() => welcomeMessageClosed && termsAccepted, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});
	});
};

const setupPaymentAccount = ({
	email = '',
	isIAV = false,
	bankName,
	isSaving = true,
	specialBankName,
	secondPaymentAccount = false,
} = {}) => {
	describe(`Set Up Payment Method ${isIAV ? '"IAV"' : '"Dwolla"'} for ${
		email || ''
	} `, () => {
		let account;
		it('Should find account with password and login', () => {
			cy.log('Getting data from JSON');
			// required for the password

			getAccount(email).then((foundAccount) => {
				account = foundAccount;
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.addPaymentAccount} using the UI`, () => {
			cy.log('Wait for loading page and correct redirect');

			containsText('h2', 'Terms Of Services and Privacy Policy', 2000).then(
				(result) => {
					if (result) {
						closePopup({ wait: 1000 });

						cy.get('input[type="checkbox"]').last().click();
						cy.contains('button', 'Submit').click();

						cy.reload();
						closePopup({ wait: 1000 });
					}
				}
			);

			containsText('h2', 'Welcome to Your Land Loans!', 1000).then((result) => {
				if (result) {
					closePopup({ wait: 1000 });
				}
			});

			cy.reload();

			closePopup({ wait: 1000 });

			if (account) {
				cy.contains('Payment Methods').click({ force: true });
			}

			if (!secondPaymentAccount) {
				navigate(appPaths.addPaymentAccount);
			} else {
				cy.contains('a', 'New Payment Method').click({ force: true });
			}
		});

		if (isIAV) {
			const testBankName = specialBankName || generateBankName({ bankName });

			it('Should Instant Account Verification', () => {
				cy.reload();

				cy.get('h4', { timeout: 5000 }).contains('ACH').parent().click();

				containsText('button', 'Understood', 2000).then((result) => {
					if (result) cy.contains('button', 'Understood').click();
				});

				cy.contains('h4', 'ACH').parent('button').click({ force: true });

				fillPlaid({ bankName, testDataForBank, isSaving, testBankName });
			});

			it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
				navigate(appPaths.paymentMethods, 1000);
			});

			it('Check Verified', () => {
				cy.wait(2000);
				cy.reload();

				cy.contains('h6', `${testBankName}`)
					.parents('tr')
					.get('td')
					.eq(3)
					.within(() => {
						cy.get('span').should('have.text', 'Verified');
					});
			});

			it('Save and update bank account', () => {
				account.bankAccounts = {};
				account.bankAccounts[testBankName] = {
					bankName: testBankName,
					verified: true,
					routingNumber: '222222226',
					accountNumber: generateAccountNumber(6),
					description: 'Account for IAV test',
				};

				saveAccount(account);
			});
		} else {
			it('Should setup bank account via Micro Deposits Verification flow', () => {
				//Add bank account information

				cy.contains('h4', 'ACH')
					.parent()
					.should('be.visible')
					.and('not.be.disabled')
					.click({ force: true });

				//Add bank account information
				const newBankAccount = copyObject(
					bankAccounts.sameDayMicroDepositsPlaid
				);
				newBankAccount.bankName = specialBankName || randomString();
				newBankAccount.verified = false;

				linkWithAccountNumbers({ bankObj: newBankAccount });

				closePopup({ text: 'Ok' });

				account.bankAccounts =
					typeof account.bankAccounts == 'undefined'
						? {}
						: account.bankAccounts;
				account.bankAccounts[newBankAccount.bankName] = newBankAccount;
				account.dateUpdated = new Date().toString();

				saveAccount(account);
			});
		}
	});
};

const verifyPaymentAccount = ({ email = '' } = {}) => {
	describe('Verify Payment Account', () => {
		let bearerToken;
		let fundingSourcesId;

		it('Should intercept user account request and save bearer token', () => {
			cy.reload();
			getAccount(email).then((foundAccount) => {
				login({ account: foundAccount, force: true });

				interceptRequest('/users?subId=*').then(({ id, request, response }) => {
					// get Bearer
					bearerToken = request.headers.authorization.replace('Bearer ', '');

					let key = Object.keys(
						response.body.ConnectedPaymentSystems.Dwolla.FundingSources
					)[0];
					fundingSourcesId = Object.values(
						response.body.ConnectedPaymentSystems.Dwolla.FundingSources[key].id
					);
				});
			});

			cy.waitUntil(() => !!bearerToken && !!fundingSourcesId, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it('Should rollback funding source added time', () => {
			const method = 'POST';
			const url = `${DEV_API_URL}/users`;
			const body = {
				rollbackFundingSourceAddedTime: {
					fundingSourceId: fundingSourcesId.join(''),
					key: '18b1-496e',
				},
			};

			const auth = {
				bearer: bearerToken,
			};

			cy.request({
				method,
				url,
				body,
				auth,
			}).then((response) => {
				expect(response.status).to.eq(200);
			});
		});

		let account;
		it('Should login with lender account', () => {
			getAccount(email).then((foundAccount) => {
				login({ account: foundAccount, force: true });

				account = foundAccount;
			});
			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		let bankAccount;
		it('Should verify Latest Bank Account via Micro Deposit Verification', () => {
			cy.wait(5000);
			cy.reload();

			navigate(appPaths.paymentMethods);

			bankAccount =
				account.bankAccounts[
					Object.keys(account.bankAccounts)[
						Object.keys(account.bankAccounts).length - 1
					]
				];

			cy.contains(bankAccount.bankName)
				.parentsUntil('tr')
				.parent()
				.first()
				.within(() => {
					cy.contains('button', 'Verify').click();
				});

			cy.log('Checking error message for invalid amounts');
			cy.get('input#amt1').clear().type('0.09');
			cy.get('input#amt2').clear().type('0.09');
			cy.get('form').submit(); // Have to use direct form submit instead.

			closePopup({ text: 'Ok' });

			cy.contains(bankAccount.bankName)
				.parentsUntil('tr')
				.parent()
				.first()
				.within(() => {
					cy.contains('button', 'Verify').click();
				});

			cy.log('Valid amounts');
			cy.get('input#amt1').clear().type('0.01');
			cy.get('input#amt2').clear().type('0.01');

			cy.get('form').submit(); // Have to use direct form submit instead.
			closePopup({ text: 'Ok' });

			cy.waitUntil(() => bankAccount, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it('Should check verify Latest Bank Account via Micro Deposit Verification', () => {
			cy.log('Need to wait for verification status to update');
			cy.wait(8000); // Need to wait for verification status to update.

			cy.reload();

			navigate(appPaths.paymentMethods);

			cy.contains(bankAccount.bankName)
				.parentsUntil('tr')
				.parent()
				.as('updatedAccountRow');

			cy.reload();

			cy.get('@updatedAccountRow').contains('span', 'Verified');

			account.bankAccounts[bankAccount.bankName].verified = true;
			account.dateUpdated = new Date().toString();

			saveAccount(account);
		});
	});
};

const dateToday = new Date().toLocaleDateString('en-US', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});
const makeManualPayment = ({
	lenderAccount,
	loanName,
	amount,
	notes = '',
	dateReceived = dateToday,
	paymentDueDate = 0,
	periodWithoutLateFees = 10,
	lateFees = 20,
}) => {
	describe(`Make Manual Payment on Loan, "${loanName}"`, () => {
		it('Should login with lender account', () => {
			getAccount(lenderAccount.email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		let loanStartBalance;
		it(`Get loan start balance in "${loanName}"`, () => {
			containsText('h6', `${loanName}`, 3000).then((result) => {
				if (!result) {
					cy.get('button[aria-label="Go to next page"]')
						.should('not.be.disabled')
						.click();
				}
			});

			cy.get('h6').contains(`${loanName}`).as('choosedLoan');
			cy.get('@choosedLoan').parents('tr').as('choosedRowOfLoan');
			cy.get('@choosedRowOfLoan').children().as('getTagTd');
			cy.get('@getTagTd').each(($el, index) => {
				if (index === 3) {
					loanStartBalance = +$el[0].innerText
						.replace('$', '')
						.replaceAll(',', '');
				}
			});

			cy.waitUntil(() => loanStartBalance, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});

			cy.log(`Start balance is - ${loanStartBalance}`);
		});

		it(`Should nav to ${appPaths.loansRecordPayment} using the UI`, () => {
			cy.log('Wait for loading page and correct redirect');

			navigate(appPaths.loansRecordPayment, 3000);
		});

		it(`Make Manual Payment on Loan in amount ${amount}`, () => {
			containsText('h4', 'Select the Loan for Payment', 4000).then(
				($isMoreOne) => {
					if ($isMoreOne) {
						cy.log('Wait for loading page and choose Loan');

						cy.url().should('include', appPaths.loansRecordPayment);

						cy.contains(loanName).click();
					}
				}
			);

			cy.get('input[value="customAmount"]').click();

			fillFiled({
				type: fieldType.input,
				selector: 'input#amount',
				value: amount,
			});

			fillFiled({
				type: fieldType.input,
				selector: 'input#description',
				value: notes,
			});

			fillFiled({
				type: fieldType.date,
				selector: 'label',
				value: dateReceived,
				content: 'Date Received',
			});

			cy.get('div#paymentDueDate').click();
			cy.get('ul[aria-labelledby="paymentDueDate-label"]')
				.first()
				.within(() => {
					cy.get('li').eq(paymentDueDate).click({ force: true });
				});

			cy.contains('button', 'Review Payment Details').click();

			cy.get('form').submit();
			closePopup({ text: 'Ok' });

			closePopup({ wait: 500 });

			cy.log('Wait for redirection.');
			cy.url().should('contain', `${appPaths.allLoans}`);
		});

		it(`Reload for correct update balance "${loanName}"`, () => {
			cy.wait(1000);
			cy.reload();
		});

		let loanEndBalance;
		it(`Compare start and end balance in "${loanName}"`, () => {
			closePopup({ wait: 2000 });
			cy.get('h6').contains(`${loanName}`).click();

			cy.get('h4').contains('Loan Balance:').as('loanBalanceBlock');
			cy.log('DateReceived:', dateReceived);
			cy.log('PeriodWithoutLateFees:', periodWithoutLateFees);

			const isLateFee = differenceDays(dateReceived, periodWithoutLateFees);
			loanEndBalance = loanStartBalance - amount; // 20$ - Late fees

			cy.log(`"loanEndBalance": ${loanEndBalance}`);
			cy.log(`isLateFee: ${isLateFee}`);

			if (isLateFee) {
				loanEndBalance += lateFees;
			}
			cy.log(`Updated "loanEndBalance": ${loanEndBalance}`);

			cy.waitUntil(() => loanEndBalance, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});

			const balanceSheetFormat = `$${loanEndBalance.toLocaleString('en-US')}`;
			cy.log(`Balance must be - ${balanceSheetFormat}`);

			cy.get('@loanBalanceBlock')
				.first()
				.within(() => {
					cy.get('span').should('contain', `${balanceSheetFormat}`);
				});
		});
	});
};

const makePayment = ({
	email = '',
	loanName = '',
	amount,
	dataOfStartLoan, // data of start loan
	lateFeePeriod = 10, // count of days for late fee
	lateFees = 0, // $ of late fees
}) => {
	describe(`Make a payment on Loan, "${loanName}"`, () => {
		let account;
		it('Should find account with password and login', () => {
			getAccount(email).then((foundAccount) => {
				account = foundAccount;
				// loanName = !!loanName ? loanName : account.loans[0]; // TODO: choose loan by loanName if loanName present
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			cy.wait(2000); // wait for loading page
			cy.contains('Loan').click({ force: true }); // for "sign-up-pay-flow-iav" need this click
		});

		let loanStartBalance;
		it(`Get loan start balance in "${loanName}"`, () => {
			cy.contains(`${loanName}`).as('choosedLoan');
			cy.get('@choosedLoan').parents('tr').as('choosedRowOfLoan');
			cy.get('@choosedRowOfLoan').children().as('getTagTd');
			cy.get('@getTagTd').each(($el, index) => {
				if (index === 3) {
					loanStartBalance = +$el[0].innerText
						.replace('$', '')
						.replaceAll(',', '');
				}
				cy.log(`Start balance is - ${loanStartBalance}`);
			});

			cy.waitUntil(() => loanStartBalance, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.loansMakePayment} using the UI`, () => {
			cy.contains('Make a payment').click({ force: true });
		});

		if (!amount) {
			it(`Get amount`, () => {
				getAccount(email).then((foundAccount) => {
					amount = foundAccount.paymentDue;
				});

				cy.waitUntil(() => amount, {
					timeout: Cypress.config('defaultCommandTimeout'),
				});
			});
		}

		it(`Should make Payment on Loan in amount`, () => {
			cy.contains('label', 'Custom Amount')
				.parent()
				.within(() => {
					cy.get('input[name="paymentAmountRadio"]').click();
				});

			cy.get('input#paymentAmount').clear().type(amount);

			const bankAccount =
				account.bankAccounts[
					Object.keys(account.bankAccounts)[
						Object.keys(account.bankAccounts).length - 1
					]
				];

			cy.contains('Select Bank Account')
				.parent()
				.contains(bankAccount.bankName, { matchCase: false })
				.click();

			cy.contains('button', 'Review Payment Details').click();

			cy.get('form').submit();
			closePopup({ text: 'Ok' });
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			// sometimes popup appears
			closePopup();
			cy.get('div').contains('Loan').click();
			cy.url().should('include', appPaths.allLoans);
		});

		it(`Reload for correct update balance "${loanName}"`, () => {
			cy.wait(1000);
			cy.reload();
		});

		let loanEndBalance;
		it(`Compare start and end balance in "${loanName}"`, () => {
			closePopup({ wait: 2000 });
			cy.get('h6').contains(`${loanName}`).click();

			cy.get('h4').contains('Loan Balance:').as('loanBalanceBlock');

			loanEndBalance = loanStartBalance - amount;

			cy.waitUntil(() => loanEndBalance, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});

			// Need for "borrower/verify-loan-status.cy.js"
			// Late fees
			const isHigherThanFeesPeriod = differenceDays(
				dataOfStartLoan,
				lateFeePeriod
			);
			cy.log('LoanEndBalance: ', loanEndBalance);
			cy.log('isHigherThanFeesPeriod: ', isHigherThanFeesPeriod);
			if (isHigherThanFeesPeriod) loanEndBalance += lateFees; // add fees if outdated payment

			cy.log('LoanEndBalance updated: ', loanEndBalance);
			const balanceSheetFormat = `$${loanEndBalance.toLocaleString('en-US')}`;
			cy.log(`Balance must be - ${balanceSheetFormat}`);

			cy.get('@loanBalanceBlock')
				.first()
				.within(() => {
					cy.get('span').should('contain', `${balanceSheetFormat}`);
				});

			loanStartBalance = undefined;
		});
	});
};

const checkAllLinks = () => {
	describe(`Checking all links`, () => {
		it(`Should nav to ${marketingPaths.base}`, () => {
			cy.visit(marketingPaths.base);
			cy.url().should('include', marketingPaths.base);
		});

		it(`Find all links ${marketingPaths.base}`, () => {
			cy.get('a').each(($el) => {
				const href = $el.attr('href');
				// const href = $el.attr('href') === undefined ? '' : $el.attr('href');

				cy.log(`Link is: ${href}`);

				href.includes('https://')
					? cy.request(`${href}`).as('link')
					: cy.request(`${marketingPaths.base}${href}`).as('link');

				cy.get('@link').should((response) => {
					expect(response.status).to.eq(200);
				});
			});
		});
	});
};

const checkAddLenderValidation = () => {
	describe(`Should require fields `, () => {
		it(`Should nav to ${marketingPaths.signup}`, () => {
			cy.visit(marketingPaths.signup);
			cy.url().should('include', marketingPaths.signup);
		});

		it(`Try submit empty form`, () => {
			signup();
		});

		it(`Check reqire errors`, () => {
			const arrSelectors = [
				{
					select: selectors.pageSignUp.userEmailInput,
					class: 'div.text-danger',
					errorText: 'Email is required',
					colorText: 'rgb(220, 53, 69)',
				},
				{
					select: selectors.pageSignUp.lastNameInput,
					class: 'div.text-danger',
					errorText: 'Last Name is required',
					colorText: 'rgb(220, 53, 69)',
				},
				{
					select: selectors.pageSignUp.businessNameInput,
					class: 'div.text-danger',
					errorText: 'Business Name is required',
					colorText: 'rgb(220, 53, 69)',
				},
				{
					select: selectors.pageSignUp.street1Input,
					class: 'div.text-danger',
					errorText: 'Street1 is required',
					colorText: 'rgb(220, 53, 69)',
				},
				{
					select: selectors.pageSignUp.cityInput,
					class: 'div.text-danger',
					errorText: 'City is required',
					colorText: 'rgb(220, 53, 69)',
				},
				{
					select: selectors.pageSignUp.stateSelector,
					class: 'div.text-danger',
					errorText: 'State is required',
					colorText: 'rgb(220, 53, 69)',
				},
				{
					select: selectors.pageSignUp.zipcodeInput,
					class: 'div.text-danger',
					errorText: 'Zipcode is required',
					colorText: 'rgb(220, 53, 69)',
				},
			];

			arrSelectors.forEach((el) => {
				cy.get(el.select)
					.parent()
					.contains(el.class, el.errorText)
					.should('have.css', 'color', el.colorText);
			});
		});
	});
};

const addLender = ({ newLenderAccount }) => {
	describe(
		`Create lender `,
		{
			viewportHeight: 1024,
		},
		() => {
			it(`Should nav to ${marketingPaths.signup}`, () => {
				cy.visit(marketingPaths.signup);
				cy.url().should('include', marketingPaths.signup);
			});

			it(`Fill and submit form`, () => {
				signup(newLenderAccount);
			});

			it(`Thanks for Signing up!`, () => {
				cy.url().should(
					'include',
					`${DEV_MARKETING_SITE_URL}/ConfirmationPage`
				);

				cy.get('h1').contains('Thanks for Signing up!');
			});

			it(`Should nav to login page`, () => {
				cy.contains('div', 'Log In').click();
			});

			it(`Should save account details for testing`, () => {
				saveAccount(newLenderAccount);
			});
		}
	);
};

const getInformationLoan = ({ email }) => {
	describe(`Get Information Loan "${email}"`, () => {
		it(`Should nav to ${marketingPaths.base}`, () => {
			cy.visit(marketingPaths.base);
			cy.url().should('include', marketingPaths.base);
		});

		it(`Get information by "${email}" and login account`, () => {
			cy.log('Email -', email);

			let account;
			getAccount(email).then((foundAccount) => {
				cy.log('Account -', foundAccount);
				login({ account: foundAccount });
				account = foundAccount;
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it('Should accept popup messages', () => {
			let welcomeMessageClosed = false;
			let termsAccepted = false;

			containsText('h2', 'Terms Of Services and Privacy Policy', 3000).then(
				(result) => {
					if (result) {
						cy.get('input[type="checkbox"]').click({ force: true });
						cy.contains('button', 'Submit').click({ force: true });
					}
					termsAccepted = true;
				}
			);

			// sometimes popup appears
			closePopup();

			containsText('h2', 'Welcome to Your Land Loans!', 3000).then((result) => {
				if (result) {
					closePopup();
				}
				welcomeMessageClosed = true;
			});

			cy.waitUntil(() => welcomeMessageClosed && termsAccepted, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});
	});
};

const reviewLoanDetails = ({
	loanName = '',
	loanStatus,
	loanBalance,
	email,
}) => {
	describe(`Review Loan Details by name - "${loanName}"`, () => {
		it('Check on popups', () => {
			// sometimes popup appears
			closePopup({ wait: 5000 });

			containsText('h2', 'Terms Of Services and Privacy Policy').then(
				(result) => {
					if (result) {
						cy.get('input[type="checkbox"]').last().click();
						cy.contains('button', 'Submit').click();
					}
				}
			);

			containsText('h2', 'Welcome to Your Land Loans!', 3000).then((result) => {
				if (result) {
					closePopup();
				}
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			// sometimes popup appears
			closePopup();

			cy.get('div').contains('Loan').click();
			cy.url().should('include', appPaths.allLoans);
		});

		it(`Choose ${loanName}`, () => {
			closePopup();
			cy.get('h6').contains(`${loanName}`).click();
		});

		let paymentDue;
		it(`Checking correct loan status, should be "${loanStatus}"`, () => {
			cy.get('span').contains('Loan Status :').parent().as('loanStatusBlock');

			cy.get('@loanStatusBlock')
				.first()
				.within(() => {
					cy.get('span').should('contain', `${loanStatus}`);
				});

			getAccount(email).then((foundAccount) => {
				paymentDue = foundAccount.paymentDue;
			});
		});

		if (!!paymentDue) {
			const paymentDueSheetFormat = `$${'0'.toLocaleString('en-US')}`;

			it(`Payment due should displays the correct amount`, () => {
				cy.get('h4').contains('Payment Due:').as('paymentDueBlock');
				cy.get('@paymentDueBlock')
					.first()
					.within(() => {
						cy.get('span').should('contain', `${paymentDueSheetFormat}`);
					});
			});

			const balanceSheetFormat = `$${(loanBalance - paymentDue).toLocaleString(
				'en-US'
			)}`;

			cy.log(`Loan Balance: ${balanceSheetFormat}`);

			it(`Loan balance: should shows the full amount`, () => {
				cy.get('h4').contains('Loan Balance:').as('loanBalanceBlock');
				cy.get('@loanBalanceBlock')
					.first()
					.within(() => {
						cy.get('span').should('contain', `${balanceSheetFormat}`);
					});
			});
		} else {
			it(`Payment due should displays the correct amount`, () => {
				cy.get('h4').contains('Payment Due:').parent().as('paymentDueBlock');

				cy.get('@paymentDueBlock')
					.contains('$')
					.then(($el) => {
						const newPaymentDue = +$el[0].innerText
							.replaceAll('$', '')
							.replaceAll(',', '');

						getAccount(email).then((foundAccount) => {
							foundAccount.paymentDue = newPaymentDue;
							saveAccount(foundAccount);
						});

						cy.log(`Payment Due: $${newPaymentDue.toLocaleString('en-US')}`);
					});
			});
		}
	});
};

const changePlanLevel = ({
	lenderAccount,
	isFree = true,
	isOnlyHighestPlan = false,
}) => {
	describe('Change Plan Level', () => {
		let account;
		it('Should login with lender account', () => {
			getAccount(lenderAccount.email).then((foundAccount) => {
				account = foundAccount;
				expect(account).to.have.property('password');
				expect(account.password).not.to.be.empty;
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.billing} using the UI`, () => {
			navigate(appPaths.billing);
		});

		let planBeforeChange;
		// let planName;
		let planAfterChange;

		for (
			let planIndex = isOnlyHighestPlan ? 2 : 0; // change planIndex related plan as we need
			planIndex < 3;
			planIndex++
		) {
			it(`Save current plan ${planIndex + 1}`, () => {
				cy.contains('label', 'Plan Level').parent().as('planLevel');
				cy.get('@planLevel').get('div').first().as('conteinerForInput');
				cy.get('@conteinerForInput').get('input').first().as('inputWithPlan');

				cy.get('@inputWithPlan').then(($el) => {
					cy.wait(100);
					planBeforeChange = $el[0].value;
					cy.wait(100);
				});
			});

			it(`Change plan ${planIndex + 1}`, () => {
				cy.contains('button', 'Edit Plan Level').click();

				cy.contains('h4', 'Select the plan level')
					.parents('form')
					.first()
					.as('popupChangePlan');

				cy.get('@popupChangePlan').within(() => {
					cy.get('div#planLevel').click();
				});

				cy.get('ul').children('li[aria-selected="false"]').as('listPlans');

				cy.get('@listPlans').then(($plan) => {
					// planName = $plan[planIndex].innerText;

					cy.get($plan[planIndex]).click();

					cy.contains('button', 'Ok').click();

					cy.contains('h2', 'Confirmation !')
						.parent()
						.first()
						.as('popupConfirmation');

					cy.contains('button', 'Confirm').click();
					closePopup({ text: 'Ok' });
				});
			});

			it(`Check current plan ${planIndex + 1}`, () => {
				cy.wait(1000); // wait necessary for correct get the value of the current plan
				const planIfFree = 'Full Tilt';
				cy.contains('label', 'Plan Level').parent().as('planLevel');
				cy.get('@planLevel').get('div').first().as('conteinerForInput');
				cy.get('@conteinerForInput').get('input').first().as('inputWithPlan');

				cy.get('@inputWithPlan').then(($el) => {
					cy.wait(100);
					planAfterChange = $el[0].value;
					if (planAfterChange.includes('Free')) {
						/// sometimes chose Free plan
						planAfterChange = planIfFree;
					}
					cy.wait(100);
				});
			});

			if (!isFree) {
				it(`Check table with current plan ${planIndex + 1}`, () => {
					cy.reload();
					// const currentDate = Date.now();

					// let day = new Date(currentDate).getDate();
					// let month = new Date(currentDate).getMonth() + 1;
					// let year = new Date(currentDate).getFullYear();

					// if (day < 10) day = `0${day}`;
					// if (month < 10) month = `0${month}`;

					// const formatedDate = `${month}/${day}/${year}`; // 07/23/2022

					// const prevPlan = planBeforeChange.replaceAll(` `, ``);
					const currentPlan = planAfterChange;

					cy.contains('label', 'Plan Level')
						.parent()
						.first()
						.within(() => {
							cy.get(`input[value="${currentPlan}"]`).should(`be.visible`);
						});

					// cy.contains(
					// 	`td`,
					// 	`YLL plan upgraded from ${prevPlan} to ${currentPlan}`
					// ).as(`YLLplan`);

					// cy.get(`@YLLplan`).should(`be.visible`);
					// cy.get(`@YLLplan`).parent().should('contain', formatedDate);
				});
			}

			it(`Compare plans ${planIndex + 1} \n -----------------------`, () => {
				cy.reload();

				cy.waitUntil(() => planBeforeChange && planAfterChange, {
					timeout: Cypress.config('defaultCommandTimeout'),
				}).then(() => {
					expect(planBeforeChange).not.to.eq(planAfterChange);
				});
			});
		}

		if (isFree) {
			it(`Change plan to back`, () => {
				cy.contains('button', 'Edit Plan Level').click();

				cy.contains('h4', 'Select the plan level')
					.parents('form')
					.first()
					.as('popupChangePlan');

				cy.get('@popupChangePlan').within(() => {
					cy.get('div#planLevel').click();
				});

				cy.get('ul').children('li[aria-selected="false"]').as('listPlans');

				cy.get('@listPlans').then(($plan) => {
					// planName = $plan[0].innerText;

					cy.get($plan[0]).click();

					cy.contains('button', 'Ok').click();

					cy.contains('h2', 'Confirmation !')
						.parent()
						.first()
						.as('popupConfirmation');

					const nextMonth_firstDay = new Date();
					new Date(
						nextMonth_firstDay.setMonth(nextMonth_firstDay.getMonth() + 2)
					);
					new Date(nextMonth_firstDay.setDate(1));

					let day = nextMonth_firstDay.getDate();
					if (day < 10) day = `0${day}`;

					let month = nextMonth_firstDay.getMonth();
					if (month < 10) month = `0${month}`;

					// const correctFormateDate = `${nextMonth_firstDay.getFullYear()}-${month}-${day}`;

					cy.contains('button', 'Confirm').click();

					closePopup({ text: 'Ok' });
				});
			});
		}
	});
};

const dwollaSignup = ({
	account,
	businessType,
	dowllaStatus,
	isRetry = false,
	isBorrower = false,
	isHasIndividual = false,
}) => {
	describe(`Create Dwolla Account for ${
		isBorrower ? 'Borrower' : 'Lenders'
	}`, () => {
		it(`Should login with lender: ${account.email}`, () => {
			getAccount(account.email).then((foundAccount) => {
				cy.log('Account -', foundAccount);
				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.addPaymentAccount} using the UI`, () => {
			containsText('h2', 'Terms Of Services and Privacy Policy', 1000).then(
				(result) => {
					if (result) {
						cy.get('input[type="checkbox"]').last().click();
						cy.contains('button', 'Submit').click();
					}
				}
			);

			containsText('h2', 'Welcome to Your Land Loans!', 3000).then((result) => {
				if (result) {
					closePopup();
				}
			});

			cy.contains('Payment Methods').click({ force: true });
			navigate(appPaths.addPaymentAccount);
		});
		if (!isBorrower) {
			it(`Create Dwolla Account step => 1 with:
		- Business Type: ${businessType}
		- Dowlla Status: ${dowllaStatus}`, () => {
				cy.url().should('contain', '/dashboard/addPaymentAccount');

				let arrSelect_dwalla_step_1 = [
					{
						select: selectors.dwollaForLenders_1.emailInput,
						typeText: account.email,
					},
					{
						select: selectors.dwollaForLenders_1.firstNameInput,
						typeText: dowllaStatus,
					},
					{
						select: selectors.dwollaForLenders_1.lastNameInput,
						typeText: account.lastName,
					},
					{
						select: selectors.dwollaForLenders_1.legalBusinessNameInput,
						typeText: account.businessName,
					},
					{
						select: selectors.dwollaForLenders_1.businessTypeSelect,
						optionText: businessType,
					},
					{
						select: selectors.dwollaForLenders_1.dwollaInitialInfoSubmitButton,
						typeButton: true,
					},
				];

				if (isRetry) {
					arrSelect_dwalla_step_1 = arrSelect_dwalla_step_1.filter(
						(_, index) =>
							![0, arrSelect_dwalla_step_1.length - 2].includes(index)
					);
				}

				// Create Dwolla Account for lenders step 1
				dwollaFillingFields(arrSelect_dwalla_step_1);
			});

			it('Create Dwolla Account step => 2', () => {
				cy.url().should('contain', '/dashboard/addPaymentAccount');

				let arrSelect_dwalla_step_2 = [
					{
						select: selectors.dwollaForLenders_2.doingBusinessAs,
						typeText: 'Doing Business As',
					},
					{
						select: selectors.dwollaForLenders_2.address1Input,
						typeText: 'Address 1',
					},
					{
						select: selectors.dwollaForLenders_2.address2Input,
						typeText: 'Address 2',
					},
					{
						select: selectors.dwollaForLenders_2.cityInput,
						typeText: 'Kyiv',
					},
					{
						select: selectors.dwollaForLenders_2.stateSelect,
						optionText: 'NY',
					},
					{
						select: selectors.dwollaForLenders_2.postalCodeInput,
						typeText: '12345',
					},
					{
						select: selectors.dwollaForLenders_2.businessClassificationSelect,
						optionText: '9ed35a29-7d6f-11e3-930b-5404a6144203',
					},
					{
						select: selectors.dwollaForLenders_2.industrySelect,
						optionText: '9ed35a2b-7d6f-11e3-942f-5404a6144203',
					},
					{
						select: selectors.dwollaForLenders_2.einInput,
						typeText: '00-0000000',
					},
					{
						select: selectors.dwollaForLenders_2.companyControllerCheckbox,
						typeButton: true,
					},
					{
						select: selectors.dwollaForLenders_2.dwollaBusinessInfoSubmitButton,
						typeButton: true,
					},
				];

				if (businessType == 'Sole Proprietorship') {
					arrSelect_dwalla_step_2 = arrSelect_dwalla_step_2.filter(
						(el) => el !== arrSelect_dwalla_step_2.at(-2)
					);
				}

				// Create Dwolla Account for lenders step 2
				dwollaFillingFields(arrSelect_dwalla_step_2);
			});

			it('Create Dwolla Account step => 3', () => {
				cy.url().should('contain', '/dashboard/addPaymentAccount');

				let arrSelect_dwalla_step_3 = [];

				if (businessType == 'Sole Proprietorship') {
					arrSelect_dwalla_step_3 = [
						{
							select:
								selectors.dwollaForLenders_3_sole_proprietorship
									.dateOfBirthControllerInput,
							typeText: '1998-05-31',
						},
						{
							select:
								selectors.dwollaForLenders_3_sole_proprietorship.ssnController,
							typeText: '0000',
						},
						{
							select:
								selectors.dwollaForLenders_3_sole_proprietorship.termsCheckbox,
							typeButton: true,
						},
						{
							select:
								selectors.dwollaForLenders_3_sole_proprietorship
									.dwollaBusinessVcrSubmitButton,
							typeButton: true,
						},
					];
				} else {
					arrSelect_dwalla_step_3 = [
						{
							select:
								selectors.dwollaForLenders_3_llc.titleInputControllerInput,
							typeText: 'My Title',
						},
						{
							select:
								selectors.dwollaForLenders_3_llc.dateOfBirthControllerInput,
							typeText: '1998-05-31',
						},
						{
							select: selectors.dwollaForLenders_3_llc.address1ControllerInput,
							typeText: 'Address 1',
						},
						{
							select: selectors.dwollaForLenders_3_llc.address2ControllerInput,
							typeText: 'Address 2',
						},
						{
							select: selectors.dwollaForLenders_3_llc.address3ControllerInput,
							typeText: 'Address 3',
						},
						{
							select: selectors.dwollaForLenders_3_llc.cityControllerInput,
							typeText: 'Kyiv',
						},
						{
							select: selectors.dwollaForLenders_3_llc.countryControllerSelect,
							optionText: 'US',
						},
						{
							select: selectors.dwollaForLenders_3_llc.stateControllerSelect,
							optionText: 'NY',
						},
						{
							select:
								selectors.dwollaForLenders_3_llc.postalCodeControllerInput,
							typeText: '12345',
						},
						{
							select: selectors.dwollaForLenders_3_llc.ssnControllerInput,
							typeText: '000000000',
						},
						{
							select: selectors.dwollaForLenders_3_llc.agreedCheckbox,
							typeButton: true,
						},
						{
							select:
								selectors.dwollaForLenders_3_llc.dwollaBusinessVcrSubmitButton,
							typeButton: true,
						},
					];
				}
				// Create Dwolla Account for lenders step 3
				dwollaFillingFields(arrSelect_dwalla_step_3);
			});

			if (
				!['Partnership', 'Sole Proprietorship'].includes(businessType) &&
				!isRetry
			) {
				addOwners({ isIAV: false, wait: 60000, isHasIndividual });
			}

			if (['document'].includes(dowllaStatus)) {
				const arrNameOfFile = [
					{
						nameOfFile: `test-document-upload-fail.png`,
						statusFile: 'rejected',
					},
					{
						nameOfFile: `test-document-upload-success.png`,
						statusFile: `sucess`,
					},
				];

				arrNameOfFile.map((el) => {
					it(`Upload document with status: ${el.statusFile}`, () => {
						cy.get('div#documentType').click();
						cy.contains('li', 'Passport').click();

						cy.get('input[type=file]').selectFile(
							`cypress/fixtures/${el.nameOfFile}`,
							{ force: true }
						);

						cy.contains('label', 'Upload').should(`not.be.disabled`).click();

						cy.contains('div', el.nameOfFile)
							.parent()
							.should('contain', `sucess`);

						cy.url().should('contain', '/dashboard/addPaymentAccount');

						cy.reload();

						if ([`rejected`].includes(el.statusFile)) {
							cy.contains('div', 'passport')
								.parent()
								.should('contain', `${el.statusFile}`);
						}
					});
				});
			}
		} else {
			it(`Create Dwolla Account with:
		- Business Type: ${businessType}
		- Dowlla Status: ${dowllaStatus}`, () => {
				cy.url().should('contain', '/dashboard/addPaymentAccount');
				let arrSelect_dwalla_step_1 = [
					{
						select: selectors.dwollaForLenders_1.emailInput,
						typeText: account.email,
					},
					{
						select: selectors.dwollaForLenders_1.firstNameInput,
						typeText: dowllaStatus,
					},
					{
						select: selectors.dwollaForLenders_1.lastNameInput,
						typeText: account.lastName,
					},
					{
						select: selectors.dwollaForBorrower.agreedCheckbox,
						typeButton: true,
					},
					{
						select:
							selectors.dwollaForBorrower.dwollaCustomerCreateSubmitButton,
						typeButton: true,
					},
				];

				if (isRetry) {
					arrSelect_dwalla_step_1 = arrSelect_dwalla_step_1.filter(
						(_, index) =>
							![0, arrSelect_dwalla_step_1.length - 2].includes(index)
					);
				}

				// Create Dwolla Account for lenders step 1
				dwollaFillingFields(arrSelect_dwalla_step_1);
				cy.wait(8000);
				cy.reload();
			});
		}
	});
};

const makeMultiplePayments = ({ lenderAccount, loan, amountPerMonth }) => {
	describe(`Make Multiple Payment on Loan, "${loan.name}"`, () => {
		it('Should login with lender account', () => {
			getAccount(lenderAccount.email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.loansRecordPayment} using the UI`, () => {
			cy.log('Wait for loading page and correct redirect');

			navigate(appPaths.loansRecordPayment, 3000);
		});

		it(`Select the Loan for multiple payments`, () => {
			containsText('h4', 'Select the Loan for Payment', 4000).then(
				($isMoreOne) => {
					if ($isMoreOne) {
						cy.log('Wait for loading page and choose Loan');

						cy.url().should('include', appPaths.loansRecordPayment);

						cy.contains(loan.name).click();
					}
				}
			);

			cy.contains('button', 'Multiple Payments').click();
		});

		it(`Checking validation of errors`, () => {
			cy.contains('button', 'Review Payment Details').click();

			cy.contains('p', 'Date recevied is Required').should(
				'have.css',
				'color',
				'rgb(255, 72, 66)'
			);
			cy.contains('p', 'Amount is Required').should(
				'have.css',
				'color',
				'rgb(255, 72, 66)'
			);
			cy.contains('p', 'Payment Due is Required').should(
				'have.css',
				'color',
				'rgb(255, 72, 66)'
			);
		});

		it(`Add one and remove two payment`, () => {
			cy.contains('button', 'Add More').click();
			cy.contains('button', 'Remove').click();
			cy.get('button[data-cy="minuseSVG"]').last().click();
		});

		it(`Getting a payment data and changing each payment (${loan.numberOfPayments} payments)`, () => {
			cy.contains('button', 'Populate Payment History?').click();

			cy.get('svg[data-testid="CheckBoxOutlineBlankIcon"]')
				.first()
				.parent()
				.click();

			cy.get('input[id="lateFees0"]').should('have.value', loan.lateFeeAmountA);

			for (let i = 0; i < loan.numberOfPayments; i++) {
				cy.get(`input#amount-${i}`).clear().type(amountPerMonth);
			}

			cy.contains('button', 'Review Payment Details').as(
				'reviewPaymentDetails'
			);

			cy.get('@reviewPaymentDetails').click();
			cy.contains('button', 'Edit Payment Details').click();
			cy.get('@reviewPaymentDetails').click();
			cy.contains('button', 'Record Payment of $').click();

			cy.contains(
				'button',
				'Payment process completed. Click here to review...'
			).click();
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			cy.wait(3000);
			cy.reload();
			cy.wait(3000);
			navigate(appPaths.allLoans);
		});

		it(`Checking correct the balance`, () => {
			const currentBalance =
				loan.financedAmount - (loan.numberOfPayments * amountPerMonth - 20); // 20 - it's late fee of $10 on one month.

			const balanceSheetFormat = `${currentBalance.toLocaleString('en-US')}`;

			cy.log(`Current Balance must be: ${balanceSheetFormat}`);

			cy.contains('h6', loan.name)
				.parents('tr')
				.first()
				.within(() => {
					cy.get('div[aria-label="Approximate"]').should(
						'contain',
						balanceSheetFormat
					);
				});
		});
	});
};

const manageFees = ({ loan, feeName, feeSum }) => {
	describe(`Add One Time Fee`, () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Open: => loan "${loan.name}" => Manage`, () => {
			cy.reload();
			cy.wait(1000);

			clickOnLoanName(loan.name);

			cy.contains('button', 'Manage').click({ force: true });
			cy.contains('li', 'Add/Remove Fees').click();
			cy.contains('button', 'Add One Time Fee').click();
		});

		it(`Adding One Time Fee (filling fields in the popup)`, () => {
			cy.get(`div#scheduledPaymentKey`).click();

			cy.get(`li`).last().click();

			cy.get(`input#oneTimeFeeKey`).clear().type(feeName);
			cy.get(`input#oneTimeFeeValue`).clear().type(feeSum);

			cy.get(`button[type="submit"]`).click();
			closePopup({ text: 'Ok' });
		});

		it(`Open "Future Payment Schedule"`, () => {
			closePopup({ wait: 2000 });
			cy.contains('h6', loan.name).parent().click();

			cy.contains('h6', 'Future Payment Schedule').click();
		});

		it(`Checking correct fee name and sum`, () => {
			cy.get('#panel1bh-content')
				.first()
				.within(() => {
					cy.get('tr').last().contains('b', feeName).parent().as(`oneTimeFees`);

					const feeSumSheetFormat = `${feeSum.toLocaleString('en-US')}`;

					cy.get(`@oneTimeFees`)
						.wait(250)
						.scrollIntoView()
						.should('contain', feeName);

					cy.get(`@oneTimeFees`).should('contain', `$${feeSumSheetFormat}`);
				});
		});
	});
};

const lateFee = ({ feeSum, loan }) => {
	describe(`Add Late Fee`, () => {
		it(`Go to: Manage => Add Late Fee`, () => {
			cy.contains('button', 'Manage').click({ force: true });
			cy.contains('li', 'Add/Remove Fees').click();
			cy.contains('button', 'Add Late Fee').click();
		});

		it(`Adding Late Fee (filling fields in the popup)`, () => {
			cy.get(`div#scheduledPaymentId`).click();
			cy.get(`li`).last().click();

			cy.get(`input#amount`).clear().type(feeSum);

			cy.get(`button[type="submit"]`).click();
			closePopup({ text: 'Ok' });

			cy.wait(3000);
			cy.reload();
		});

		it(`Should close the popup if opened and open correct loan "${loan.name}"`, () => {
			closePopup({ wait: 2000 });

			clickOnLoanName(loan.name);
		});

		it(`Checking removing Late Fee`, () => {
			cy.contains('h6', 'Historical Payment Schedule').click();

			cy.get('div#panel1bh-header[aria-expanded="true"]');

			cy.get('div#panel1bh-content')
				.last()
				.wait(250)
				.scrollIntoView()
				.within(() => {
					cy.get('th').each(($el, feeSumIndex) => {
						if ($el[0].innerText === 'Late Fees') {
							cy.get('td').eq(feeSumIndex).should('contain', feeSum); // "feeSumIndex" it index of column Late Fees;
						}
					});
				});
		});
	});
};

const removeFee = ({ feeName, typeFee, feeSum, loan }) => {
	let fee;
	let fieldSelector;

	let nameOfDropdown;

	switch (typeFee) {
		case `oneTime`:
			fee = `Remove One Time Fee`;
			fieldSelector = `div#scheduledPaymentKey`;
			nameOfDropdown = `Historical Payment Schedule`;
			break;
		case `late`:
			fee = `Remove Late Fee`;
			fieldSelector = `div#scheduledPaymentId`;
			nameOfDropdown = `Future Payment Schedule`;
			break;

		default:
			break;
	}

	describe(`Remove Fee by name(${feeName})`, () => {
		it(`Go to: Manage => Remove Fee`, () => {
			cy.contains('button', 'Manage').click({ force: true });
			cy.contains('li', 'Add/Remove Fees').click();
			cy.contains('button', fee).click();
		});

		it(`${fee} (choosing fields in the popup)`, () => {
			cy.get(fieldSelector).click();
			cy.get(`li`).last().click();

			if (typeFee.includes(`oneTime`)) {
				cy.get(`div#oneTimeFeeKey`).click();
				cy.get(`li`).last().should('contain', feeName).click();
			}

			cy.get(`button[type="submit"]`).click();
			closePopup({ text: 'Ok' });
		});

		it(`Should close the popup if opened and open correct loan "${loan.name}"`, () => {
			closePopup({ wait: 2000 });

			clickOnLoanName(loan.name);
		});

		it(`Checking ${fee}`, () => {
			cy.contains('h6', nameOfDropdown).click();

			if (typeFee.includes(`late`)) {
				cy.get('div#panel1bh-content')
					.last()
					.wait(250)
					.scrollIntoView()
					.within(() => {
						cy.get('td').eq(6).should('not.have.text', feeSum); // 6 it index of column Late Fees;
					});
			}

			if (typeFee.includes(`oneTime`)) {
				cy.get('#panel1bh-content')
					.first()
					.within(() => {
						cy.get('tr')
							.last()
							.wait(250)
							.scrollIntoView()
							.should('not.have.text', feeName);
					});
			}
		});
	});
};

const editFees = ({ changeSection, isDisabled = false, dataForUpdate }) => {
	describe(`Edit Late Fee by "${changeSection}"`, () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			cy.wait(3000);
			cy.reload();
			navigate(appPaths.allLoans);
		});

		it(`Open loan by name(${dataForUpdate.name})`, () => {
			clickOnLoanName(dataForUpdate.name);
		});

		it(`Go to: Manage => Edit Loan`, () => {
			cy.contains('button', 'Manage').click({ force: true });
			cy.contains('li', 'Edit Loan').click();
		});

		it(`Changes "${changeSection}" section.\nDisabled: ${isDisabled}`, () => {
			const regexUpdate = new RegExp('Update$', 'g');

			const changeSectionFn = (status) => {
				cy.log(`Chack section to ${status}`);
				cy.contains('p', changeSection)
					.parent()
					.parent()
					.first()
					.within(() => {
						if (status.includes('enabled')) {
							cy.get('button').click();
						} else {
							cy.get('button').should(`be.${status}`);
						}
					});
			};

			if (isDisabled === `first_step_disabled`) {
				changeSectionFn(`disabled`);
			} else if (isDisabled === `second_step_disabled`) {
				changeSectionFn(`enabled`);

				switch (changeSection) {
					case `Late Fees`:
						cy.get('button').contains(regexUpdate).should('be.disabled');
						break;
					case `Transactional Fees`:
						cy.get('button').contains(regexUpdate).should('be.disabled');
						break;
					case `Monthly Fees`:
						cy.get('button').contains(regexUpdate).should('be.enabled');
						cy.get('button').contains(`Cancel`).click();
						break;
					default:
						break;
				}
			} else {
				changeSectionFn(`enabled`);

				switch (changeSection) {
					case `Late Fees`:
						cy.get('input#amount').clear().type(`${dataForUpdate.amount}`);
						cy.get('input#lateFeePeriodDays')
							.clear()
							.type(dataForUpdate.lateFeePeriodDays);

						break;
					case `Transactional Fees`:
						cy.get('input#achFlat').clear().type(dataForUpdate.achFlat);
						cy.get('input#achPercentage')
							.clear()
							.type(dataForUpdate.achPercentage);
						cy.get('input#creditcardFlat')
							.clear()
							.type(dataForUpdate.creditcardFlat);
						cy.get('input#creditcardPercentage')
							.clear()
							.type(dataForUpdate.creditcardPercentage);

						break;
					case `Monthly Fees`:
						cy.contains('button', 'Add Fees').click();
						cy.get('input#fee-title-1').clear().type(dataForUpdate.feeTitle);
						cy.get('input#charges-1').clear().type(dataForUpdate.charges);

						break;
					default:
						break;
				}

				cy.get('button').contains(regexUpdate).click();

				closePopup({ text: 'Ok' });
			}
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			closePopup();
			navigate(appPaths.allLoans);
		});

		it(`Open loan by name(${dataForUpdate.name})`, () => {
			clickOnLoanName(dataForUpdate.name);
		});
	});
};

const changingLoanStatus = ({
	currentStatusLoan,
	nextStatusLoan,
	loanName,
}) => {
	describe(`Сhanging Loan Status from ${currentStatusLoan} to ${nextStatusLoan}`, () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			cy.reload();
			closePopup({ wait: 3000 });
			navigate(appPaths.allLoans);
		});

		it(`Choose ${loanName}`, () => {
			closePopup();
			clickOnLoanName(loanName);
		});

		it(`Go to: Manage => Edit Loan`, () => {
			cy.contains('button', 'Manage').click({ force: true });
			cy.contains('li', 'Edit Loan').click();
		});

		it(`Current status: ${currentStatusLoan}`, () => {
			cy.contains('button', 'Update Loan Status').click();
			cy.contains('h4', 'Select the loan status')
				.parent()
				.should('contain', `${currentStatusLoan}`)
				.and('have.length', 1);
		});

		it(`Next status: ${nextStatusLoan}`, () => {
			cy.get('div#loanStatus').click();
			cy.get(`li[data-value="${nextStatusLoan}"]`).click();
		});

		it(`Confirm!`, () => {
			cy.contains(`button`, `Confirm`).click();

			cy.get(`button[type="submit"]`).click();
			closePopup({ text: 'Ok' });
		});
	});
};

const checkFieldOnLoanPage = ({ elementsForCheck }) => {
	describe('Should check fields on loan page', () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.editLoan);
		});

		it('Should check fields', () => {
			elementsForCheck.map((el) => {
				cy.contains('h6', el.title).parent().parent().contains('p', el.value);
			});
		});
	});
};

const checkChanges = ({ dataForUpdate }) => {
	describe(`Сhanging Loan Status`, () => {
		it(`Check "Payments"`, () => {
			const listKeysPayments = [
				{
					title: 'Sale Price',
					value: 'salePrice',
				},
				{
					title: 'Loan Origination Date',
					value: 'loanOriginationDate',
				},
			];

			listKeysPayments.map((el) => {
				cy.contains(el.title)
					.parent()
					.parent()
					.within(() => {
						cy.contains(dataForUpdate[el.value]);
					});
			});
		});

		it(`Check "Interest"`, () => {
			cy.contains('Interest Start Date')
				.parent()
				.parent()
				.within(() => {
					cy.contains(dataForUpdate.interestStartDate);
				});
		});

		it(`Check "Miscellaneous"`, () => {
			const listKeysPayments = [
				{
					title: 'County',
					value: dataForUpdate.county,
				},
				{
					title: 'Default Period',
					value: dataForUpdate.daysBeforeDefault,
				},
				{
					title: 'Parcel Number(s)',
					value: dataForUpdate.parcelNumbers,
				},
				{
					title: 'State',
					value: dataForUpdate.state.match(/(\b\w{2}\b)/gm)[0],
				},
			];

			listKeysPayments.map((el) => {
				cy.contains(el.title)
					.parent()
					.parent()
					.within(() => {
						cy.contains(el.value);
					});
			});

			cy.contains(dataForUpdate.name).should('be.visible');
		});

		it(`Open loan by name(${dataForUpdate.name})`, () => {
			navigate(appPaths.allLoans);
			closePopup();
			clickOnLoanName(dataForUpdate.name);
		});

		it(`Check "Monthly Fee(s)"`, () => {
			cy.contains('h6', 'Monthly Fee(s)')
				.parent()
				.parent()
				.first()
				.within(() => {
					cy.get('p').should(
						'contain',
						`${dataForUpdate.feeTitle}: $${dataForUpdate.charges}.00`
					);
				});
		});

		it(`Check "Transactional Fee(s)"`, () => {
			cy.contains('p', 'Ach Flat').should('contain', dataForUpdate.achFlat);
			cy.contains('p', 'Ach Percentage').should(
				'contain',
				dataForUpdate.achPercentage
			);
			cy.contains('p', 'Creditcard Flat').should(
				'contain',
				dataForUpdate.creditcardFlat
			);
			cy.contains('p', 'Creditcard Percentage').should(
				'contain',
				dataForUpdate.creditcardPercentage
			);
		});

		it(`Check "Late Fee(s)"`, () => {
			cy.contains('p', 'Amount').should('contain', dataForUpdate.amount);
			cy.contains('p', 'Late Fee Period Days').should(
				'contain',
				dataForUpdate.lateFeePeriodDays
			);
		});
	});
};

const downloanLoanData = ({ loan, isCurrentLoan, isAllLoans }) => {
	describe(`Downloan Loan${loan.name} Data`, { viewportHeight: 768 }, () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			cy.reload();
			navigate(appPaths.allLoans);
		});

		it(`Open loan by name(${loan.name})`, () => {
			clickOnLoanName(loan.name);
		});

		it(`Go to: Manage => Edit Loan and download ${
			isCurrentLoan && isAllLoans
				? 'both'
				: isCurrentLoan
				? 'current'
				: isAllLoans
				? 'all'
				: 'nothing'
		}`, () => {
			cy.contains('button', 'Manage').click({ force: true });
			cy.contains('li', 'Download Loan Data').click();

			if (isCurrentLoan) {
				cy.contains('h5', 'Download this Loan').parents('button').click();
				cy.log('Download current Loan Data');
			}

			if (isAllLoans) {
				cy.contains('h5', 'Download all Loans').parents('button').click();
				cy.log('Download all Loans Datas');
			}

			cy.window()
				.document()
				.then(function (doc) {
					doc.addEventListener('click', () => {
						// this adds a listener that reloads your page
						// after 5 seconds from clicking the download button
						setTimeout(function () {
							doc.location.reload();
						}, 5000);
					});
					cy.contains('Cancel').first().click();
				});
		});
	});
};

const dataToJSON = ({ nameOfFile }) => {
	describe('Convert data to JSON', () => {
		const namesOfTables = [];

		it('Read data from excel', () => {
			cy.wait(5000); // time for downloan

			cy.parseXlsx(`cypress/downloads/${nameOfFile}.xlsx`).then(
				(arrJSONDataTables) => {
					// filtering the wrong tables (mby. temporary)
					const newArrJSONDataTables = arrJSONDataTables.filter(
						(table) => 'Due Date' in table[0]
					);

					newArrJSONDataTables.map((table, indexOfTable) => {
						table.map((elemOfObj) => {
							// adding table name
							if (`Loan:` in elemOfObj) {
								namesOfTables.push({
									nameOfTable: elemOfObj[`Loan:`],
									dataOfJSON: {},
								});
							}

							let key;
							// formatting data
							if ('Due Date' in elemOfObj) {
								// generete key in correct formate
								key = new Date(elemOfObj[`Due Date`]).toLocaleDateString(
									'fr-CA'
								);
							}

							namesOfTables[indexOfTable].dataOfJSON[key] = elemOfObj;
						});
					});
				}
			);
		});

		it('Write JSON Files', () => {
			namesOfTables.map(({ nameOfTable, dataOfJSON }) => {
				cy.writeFile(`cypress/downloads/${nameOfFile}/${nameOfTable}.json`, {
					...dataOfJSON,
				});
			});
		});

		it(`Compare JSON Files:`, () => {
			cy.log(
				`List of Files:${namesOfTables.map((el) => el.nameOfTable).join(' | ')}`
			);
			let prevSelector;

			namesOfTables.map(({ nameOfTable, dataOfJSON }) => {
				// open the correct loan by name for correct compare
				clickOnLoanName(nameOfTable);

				cy.log(`Current comparing table: ${nameOfTable}`);

				for (let date in dataOfJSON) {
					// switch to the correct selector for open correct dropdown for comparing
					let isSelector;
					if (dataOfJSON[date]['Payment Type'] == 'Actual') {
						isSelector = `Historical Payment Schedule`;
					} else {
						isSelector = `Future Payment Schedule`;
					}

					if (prevSelector !== isSelector) {
						prevSelector = isSelector;
						cy.contains('h6', isSelector).click();
					}

					// click on the selector for open dropdown
					cy.contains('h6', isSelector)
						.parent()
						.parent()
						.parent()
						.parent()
						.within(() => {
							cy.contains('td', dataOfJSON[date]['Due Date'])
								.parent()
								.each(($el) => {
									// formatting data for correct compare

									// exapmle: '02/01/2023	$3,333.33	$0.00	$0.00	$0.00	$0.00	$0.00			$100,000.00	$100,000.00	'
									const listOfValuesInRow = $el[0].innerText;

									// exapmle: ['02/01/2023\t', '3,333.33\t', '0.00\t', '0.00\t', '0.00\t', '0.00\t', '0.00\t\t\t', '100,000.00\t', '100,000.00\t']
									const arrWithGaps = listOfValuesInRow.split('$');

									// exapmle: ['02/01/2023', '3333.33', '0.00', '0.00', '0.00', '0.00', '0.00', '100000.00', '100000.00']
									const arrOfValues = arrWithGaps.map((el) =>
										el.trim().replaceAll(',', '')
									);

									// comparing
									cy.log(`Index of row: 0`);
									expect(arrOfValues[0]).to.contain(
										dataOfJSON[date]['Due Date']
									);

									cy.log(`Index of row: 1`);
									expect(arrOfValues[1]).to.contain(
										dataOfJSON[date]['Required Payment']
									);

									if (dataOfJSON[date]['Payment Type'] == 'Actual') {
										cy.log(`Index of row: 2`);
										expect(arrOfValues[2]).to.contain(
											dataOfJSON[date]['Total Payment']
										);
									}

									cy.log(`Index of row: 3`);
									expect(arrOfValues[3]).to.contain(
										dataOfJSON[date]['Principal']
									);

									cy.log(`Index of row: 4`);
									expect(arrOfValues[4]).to.contain(
										dataOfJSON[date]['Interest']
									);

									cy.log(`Index of row: 5`);
									expect(arrOfValues[5]).to.contain(
										dataOfJSON[date]['Fees'] // not "Fees Paid"!!
									);

									// if (dataOfJSON[date]['Payment Type'] === 'Projected') {

									// temporary comment !!!
									// cy.log(`Index of row: 7`);
									// expect(arrOfValues[7]).to.contain(
									// 	dataOfJSON[date]['Beginning Balance']
									// );

									cy.log(`Index of row: 8`);
									expect(arrOfValues[8]).to.contain(
										dataOfJSON[date]['Ending Balance']
									);
									// } else {
									// cy.log(`Index of row: 7`);
									// expect(arrOfValues[7]).to.contain(
									// 	dataOfJSON[date]['Late Fee'] // not "Late Fees"!!
									// );

									// cy.log(`Index of row: 8`);
									// expect(arrOfValues[8]).to.contain(
									// 	dataOfJSON[date]['Beginning Balance']
									// );

									// cy.log(`Index of row: 9`);
									// expect(arrOfValues[9]).to.contain(
									// 	dataOfJSON[date]['Ending Balance']
									// );
									// }
								});
						});
				}
				// close the correct loan by name for correct compare
				cy.contains('button', 'Close').click({ force: true });
			});
		});
	});
};

const createRecordPayment = ({ loan, amount, dateReceived = dateToday }) => {
	describe('Create Record Payment', () => {
		it(`Should nav to ${appPaths.loansRecordPayment} using the UI`, () => {
			navigate(appPaths.loansRecordPayment);
		});

		it(`Filling fields `, () => {
			cy.get('input[value="customAmount"]').click();

			fillFiled({
				type: fieldType.input,
				selector: 'input#amount',
				value: amount,
			});

			fillFiled({
				type: fieldType.input,
				selector: 'input#description',
				value: loan.name,
			});

			fillFiled({
				type: fieldType.date,
				selector: 'label',
				value: dateReceived,
				content: 'Date Received',
			});

			cy.get('div#paymentDueDate').click();
			cy.get('ul[aria-labelledby="paymentDueDate-label"]')
				.first()
				.within(() => {
					cy.get('li').first().click();
				});

			cy.contains('button', 'Review Payment Details').as(
				'reviewPaymentDetails'
			);

			cy.get('@reviewPaymentDetails').click();
			cy.contains('button', 'Edit Payment Details').click();
			cy.get('@reviewPaymentDetails').click();

			cy.contains('button', 'Record Payment of $').click();
			closePopup({ text: 'Ok' });
		});

		it(`Should nav to using the UI`, () => {
			// sometimes popup appears
			closePopup();

			cy.reload();
		});
	});
};

const updateRecordPayment = ({ loan, amountForChange }) => {
	describe('Update Record Payment', () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			containsText('button', 'Close', 500).then(($isExist) => {
				if ($isExist) {
					cy.contains('button', 'Close').click({ force: true });
				}
			});

			navigate(appPaths.allLoans);
		});

		it(`Open loan by name(${loan.name})`, () => {
			clickOnLoanName(loan.name);

			cy.contains(`button`, `Payment History`).click();
		});

		it(`Updating amount`, () => {
			cy.get(`button#basic-menu`).click();
			cy.contains(`button`, `Update`).click();

			cy.get(`input#paymentAmount`).clear().type(amountForChange);
			cy.contains(`button`, `Save`).click();

			closePopup({ text: 'Ok' });
		});
	});
};

const deleteRecordPayment = ({ loan, amountForChange }) => {
	describe('Delete Record Payment', () => {
		it(`Open loan by name(${loan.name})`, () => {
			closePopup({ wait: 500 });
			clickOnLoanName(loan.name);
			cy.contains(`button`, `Payment History`).click();
			// checking
			cy.contains(`p`, `$${amountForChange}`).should('be.visible');
		});

		it(`Click to "Delete"`, () => {
			cy.contains(`button`, `Delete`).click();

			cy.contains(`button`, `Confirm`).click();
			closePopup({ text: 'Ok' });
		});

		it(`Open loan by name(${loan.name}) and check for "No payments"`, () => {
			cy.reload();
			closePopup({ wait: 500 });
			clickOnLoanName(loan.name);
			cy.contains(`button`, `Payment History`).click();

			cy.contains(`td`, `No payments have been made`);
		});
	});
};

const schedulePayment = ({
	isRecurringPayment = false,
	amount,
	borrowerAccount,
	loanName = null,
}) => {
	const typePayment = isRecurringPayment
		? 'Recurring Monthly Payments'
		: 'One Time Payment';

	describe(`Create ${typePayment}`, () => {
		let account;
		it('Should login with borrower account', () => {
			getAccount(borrowerAccount.email).then((foundAccount) => {
				account = foundAccount;
				expect(account).to.have.property('password');
				expect(account.password).not.to.be.empty;

				login({ account });
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.loansMakePayment} using the UI`, () => {
			closePopup({ wait: 2000 });

			navigate(appPaths.loansMakePayment);

			// cy.contains('Make a payment').click({ force: true });
			closePopup({ wait: 2000 });
		});

		if (loanName) {
			it(`Should Select the Loan for Payment`, () => {
				containsText('h4', 'Select the Loan for Payment', 4000).then(
					($isMoreOne) => {
						if ($isMoreOne) {
							cy.log('Wait for loading page and choose Loan');

							cy.url().should('include', appPaths.loansMakePayment);

							cy.contains(loanName).first().click();
						}
					}
				);
			});
		}

		it(`Adding ${typePayment}`, () => {
			if (!isRecurringPayment) {
				containsText('button', 'Recurring Monthly Payments', 1000).then(
					($isExist) => {
						if ($isExist) {
							cy.contains('button', 'Recurring Monthly Payments').click();
						}
					}
				);
				cy.contains(`button`, `${typePayment}`).click();
			}

			cy.get(`input[name="paymentAmountRadio"][value="radio_3"]`)
				.first()
				.click({ force: true });

			// closePopup({ wait: 1000, text: 'Ok' });

			cy.get(`input#paymentAmount`).clear().type(amount);
		});

		it(`Select Bank Account and Filling fields and send payment`, () => {
			const bankAccount =
				account.bankAccounts[
					Object.keys(account.bankAccounts)[
						Object.keys(account.bankAccounts).length - 1
					]
				];

			cy.contains('Select Bank Account')
				.parent()
				.contains(bankAccount.bankName, { matchCase: false })
				.click();

			if (!isRecurringPayment) {
				containsText('button', 'Close', 5000).then(($isExist) => {
					if ($isExist) {
						cy.contains('button', 'Close').click({ force: true });
						cy.contains('Make a payment').click({ force: true });
					}
				});

				cy.contains(`label`, `Payment Date`)
					.parent()
					.within(() => {
						cy.get('input').click({ force: true });
					});

				cy.get(`svg[data-testid="ArrowRightIcon"]`)
					.parent()
					.click({ force: true }); // next month

				cy.get(`button[role="gridcell"]`).contains(`1`).click({ force: true });
				cy.contains(`button`, `OK`).click();

				cy.contains('label', 'Notes (Optional)')
					.parent()
					.get('input[placeholder="Extra January Payment"]')
					.clear()
					.type('Cypress automated test payment.');
			}

			cy.contains('button', 'Review Payment Details').click();

			if (!isRecurringPayment) {
				cy.contains('button', 'Confirm Payment of').click();
			} else {
				cy.contains('button', 'Schedule Payment of').click();
			}

			closePopup({ wait: 1000, text: 'Confirm Payment' });
			closePopup({ wait: 1000, text: 'Ok' });
			closePopup({ wait: 1000 });
		});
	});
};

const editeSchedulePayment = ({ selectPaymentType, newAmount }) => {
	describe(`Edite Schedule Payment`, () => {
		it(`Should nav to ${appPaths.scheduledPayments} using the UI`, () => {
			navigate(appPaths.scheduledPayments, 1000);
		});

		it(`Open popup of payment type`, () => {
			cy.contains(`p`, selectPaymentType)
				.parents(`tr`)
				.first()
				.within(() => {
					cy.get(`td`).last().get(`button`).last().click();
				});
		});

		it(`Open edit page and edite payment`, () => {
			cy.contains(`p`, `Edit`).click();

			cy.get(`input[name="PaymentAmount"]`).clear().type(newAmount);

			cy.contains(`label`, `Day of the Month for Recurring Deposit`)
				.parent()
				.click();

			cy.contains(`li`, `27`).click();
			cy.get(`input[name="Description"]`).clear().type(`Updated 👌🏻`);

			cy.get(`button[type="submit"]`).click();
			closePopup({ text: 'Ok' });

			closePopup({ wait: 2500 });
		});
	});
};

const compareSchedulePayment = ({ selectPaymentType, amount }) => {
	describe(`Compare Schedule Payment`, () => {
		it(`Should nav to ${appPaths.scheduledPayments} using the UI`, () => {
			navigate(appPaths.scheduledPayments, 1000);
		});

		it(`Comparing ${selectPaymentType}`, () => {
			cy.contains(`p`, selectPaymentType)
				.parents(`tr`)
				.should(`contain`, `$${amount}`);
		});
	});
};

const editeProfile = ({
	email,
	userAccount,
	withPublic = false,
	onlyFullName = false,
	typeChecking,
	loanName,
}) => {
	describe(`Edite profile`, () => {
		if (email) {
			let account;
			it(`Should login with ${email} account`, () => {
				getAccount(email).then((foundAccount) => {
					account = foundAccount;
					expect(account).to.have.property('password');
					expect(account.password).not.to.be.empty;

					login({ account });
				});

				cy.waitUntil(() => account, {
					timeout: Cypress.config('defaultCommandTimeout'),
				});
			});
		}

		let accountForUpdating;
		it(`Should get ${userAccount.email} account`, () => {
			getAccount(userAccount.email).then((foundAccount) => {
				accountForUpdating = foundAccount;
			});

			cy.waitUntil(() => accountForUpdating, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Prepare data for updating`, () => {
			// prepare data for updating
			for (const key in accountForUpdating) {
				if (
					[
						`email`,
						`dateCreated`,
						`password`,
						`dateUpdated`,
						`bankAccounts`,
						`loans`,
					].includes(key)
				) {
					continue;
				} else if (key === `publicContactEmail`) {
					accountForUpdating.publicContactEmail =
						accountForUpdating.publicContactEmail.replace(
							`pub_`,
							`pub_updated`
						);
				} else if (key === 'zipcode') {
					accountForUpdating.zipcode = 10101;
				} else if (key === 'state') {
					accountForUpdating.state = `CA`;
				} else if (isNaN(accountForUpdating[key])) {
					accountForUpdating[key] = `${accountForUpdating[key]}_updated`;
				} else {
					accountForUpdating[key] = `${accountForUpdating[key]}01010`;
				}
			}

			saveAccount(accountForUpdating);

			cy.wait(500);
		});

		it(`Should nav to ${appPaths.profile} using the UI`, () => {
			if ([typeChecking].includes(`in the loan`)) {
				navigate(appPaths.allLoans);
				closePopup();
				clickOnLoanName(loanName);
				cy.contains(`Edit Borrower`).scrollIntoView().click();
			} else {
				navigate(appPaths.profile);

				cy.contains(`button`, `Edit Profile`).click();
			}
		});

		it(`Filling forms`, () => {
			fillFullNameEmail({ user: accountForUpdating });

			if (!onlyFullName) {
				cy.get('input#street1').clear().type(accountForUpdating.street1);
				cy.get('input#street2').clear().type(accountForUpdating.street2);

				cy.get('div#state').click();
				cy.get('li[data-value="CA"]').click();

				cy.get('input#city').clear().type(accountForUpdating.city);
				cy.get('input#zipcode').clear().type(accountForUpdating.zipcode);
			}

			if (withPublic) {
				cy.get('input#publicContactEmail')
					.clear()
					.type(accountForUpdating.publicContactEmail);
				cy.get('input#businessName')
					.clear()
					.type(accountForUpdating.businessName);
				cy.get('input#businessPublicName')
					.clear()
					.type(accountForUpdating.businessPublicName);
				cy.get('input#publicPhoneNumber')
					.clear()
					.type(accountForUpdating.publicPhoneNumber);
			}

			cy.contains(`button`, `Update`).click();
			closePopup({ text: 'Ok' });
		});
	});
};

const checkProfileAfterEdite = ({
	userAccount,
	withPublic = false,
	onlyFullName = false,
}) => {
	describe(`Check Profile After Edite`, () => {
		let accountForUpdating;
		it(`Should get ${userAccount.email} account`, () => {
			getAccount(userAccount.email).then((foundAccount) => {
				accountForUpdating = foundAccount;
			});

			cy.waitUntil(() => accountForUpdating, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should to check update`, () => {
			let obj = {
				firstName: `Name`,
				lastName: `Name`,
			};

			if (!onlyFullName) {
				obj = {
					...obj,
					street1: `Street 1`,
					street2: `Street 2`,
					zipcode: `ZipCode`,
					state: `State`,
					city: `City`,
				};
			}

			if (withPublic) {
				obj = {
					...obj,
					publicContactEmail: `Public Email`,
					businessName: `Business Name`,
					businessPublicName: `Public Business Name`,
					publicPhoneNumber: `Public Phone Number`,
				};
			}

			for (const key in obj) {
				cy.contains(`h6`, `${obj[key]}`)
					.parent()
					.parent()
					.within(() => {
						cy.get(`div`)
							.last()
							.then(() => {
								cy.contains(`${accountForUpdating[key]}`);
							});
					});
			}
		});
	});
};

const addBankForBorrower = ({
	lenderEmail,
	borrower,
	loanName,
	testBankName,
}) => {
	describe(`Add Bank For Borrower`, () => {
		it(`Should login with: ${lenderEmail}`, () => {
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
			navigate(appPaths.paymentMethods);
		});

		it(`Should nav to ${appPaths.addBorrowerPaymentMethod} using the UI`, () => {
			navigate(appPaths.addBorrowerPaymentMethod);
		});

		//Add bank account information
		const newBankAccount = copyObject(bankAccounts.sameDayMicroDepositsPlaid);
		newBankAccount.bankName = testBankName;
		newBankAccount.verified = false;

		it(`Should add bank for borrower`, () => {
			cy.contains(`${loanName}`).click();

			cy.get(`div#borrowerId`).click();
			cy.contains(`li`, `${borrower.firstName} ${borrower.lastName}`).click();

			cy.contains('h5', 'ACH').parent('button').as('ACH');

			cy.get('@ACH').should('not.be.disabled').click({ force: true });

			linkWithAccountNumbers({ bankObj: newBankAccount });

			closePopup({ text: 'Ok' });
		});

		let borrowerAccount;
		it(`Should login with: ${borrower.email}`, () => {
			getAccount(borrower.email).then((foundAccount) => {
				borrowerAccount = foundAccount;
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});

			cy.waitUntil(() => borrowerAccount, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should save account details for testing`, () => {
			borrowerAccount.bankAccounts =
				typeof borrowerAccount.bankAccounts == 'undefined'
					? {}
					: borrowerAccount.bankAccounts;
			borrowerAccount.bankAccounts[newBankAccount.bankName] = newBankAccount;
			borrowerAccount.dateUpdated = new Date().toString();

			saveAccount(borrowerAccount);
		});
	});
};

const checkPaymentMethod = ({ email, bankName }) => {
	describe(`Сhecking the payment method`, () => {
		it(`Should login with lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
			navigate(appPaths.paymentMethods, 1000);
		});

		if (bankName) {
			it('Check Verified', () => {
				cy.contains('h6', `${bankName}`)
					.parents('tr')
					.within(() => {
						cy.get('span').should('have.text', 'Verified');
					});
			});
		}
	});
};

const checkEmails = ({
	email = '',
	receipentsEmail,
	loanName,
	arrOfType = [],
}) => {
	describe(`Checking the emails`, () => {
		it(`Should login with lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Should choose "${loanName}"`, () => {
			cy.reload();
			closePopup({ wait: 3000 });
			clickOnLoanName(loanName);
		});

		it(`Should nav to "Email History"`, () => {
			cy.contains(`button`, `Email History`).click();
		});

		if (receipentsEmail) {
			it(`Choose receipents "${receipentsEmail}"`, () => {
				cy.contains(`label`, `Receipents`).parent().click();

				cy.get(`li[data-value="${receipentsEmail}"]`).click();
			});
		}

		arrOfType.map((titleOfLetter) => {
			it(`Checking ${titleOfLetter}`, () => {
				cy.contains(`h6`, `${titleOfLetter}`);
			});
		});
	});
};

const addPartner = ({
	lenderEmail,
	partnerAccount,
	loanName,
	checkLimit = false,
	submit = false,
}) => {
	describe(`Add Partner "${partnerAccount.email}"`, () => {
		it(`Should login with lender: ${lenderEmail}`, () => {
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		// it(`Should reload page`, () => {
		// 	cy.wait(8000);
		// 	cy.reload();
		// });

		if (checkLimit) {
			it(`Should click on "Add Partner" using the UI`, () => {
				cy.wait(8000);
				cy.reload();
				cy.contains(`Partners`).click({ force: true });
				cy.contains(`button`, `Add Partner`).should(`be.visible`);
			});
		} else {
			it(`Should click on "Partner" using the UI`, () => {
				// closePopup({ text: 'OK', wait: 3000 });
				cy.contains(`Partners`).click();
				cy.contains(`button`, `Add Partner`).click({ force: true });
				cy.contains(loanName).should('have.length', 1).click();

				if (submit) {
					console.log('submit');
					cy.get(`button[type="submit"]`).click(); // sovled issue with "check-accessability-plan-levels.cy.js"
				} else {
					console.log('not submit');
					cy.contains(`button`, `Add Partner`).click({ force: true });
				}
			});

			it(`Should fill in partner details`, () => {
				fillFullNameEmail({
					user: partnerAccount,
					emailSelect: selectors.pageSignUp.userEmailInput,
				});
			});

			it(`Should click submit button and get message "User created successfully"`, () => {
				cy.contains('button', 'Submit').should('not.be.disabled').click();

				acceptPopup({ role: `Partner` });
			});

			it(`Should save account details for testing`, () => {
				let loans = partnerAccount.loans;
				loans =
					typeof loans !== 'undefined' && Array.isArray(loans) ? loans : [];
				loans.push(loanName);
				partnerAccount.loans = loans;

				saveAccount(partnerAccount);
			});
		}
	});
};

const removeUserFromLoan = ({
	email = '',
	userAccount,
	loanName,
	typeAccount,
}) => {
	describe(`Remove ${typeAccount} from Loan`, () => {
		it(`Should login with lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			closePopup();
			navigate(appPaths.allLoans);
			closePopup({ wait: 3000 });
		});

		it(`Should choose "${loanName}"`, () => {
			containsText('h6', `${loanName}`, 0).then((result) => {
				if (result) {
					it(`Should choose "${loanName}"`, () => {
						clickOnLoanName(loanName);
					});

					it(`User: "${userAccount.email}"
			Loan: "${loanName}"`, () => {
						cy.contains(`button`, `Remove ${typeAccount}`)
							.scrollIntoView()
							.click();

						const fullName = `${userAccount.firstName} ${userAccount.lastName}`;

						const textInPopup = `Are you sure you want to remove ${fullName} from this loan?`;
						cy.contains(`p`, `${textInPopup}`)
							.parent()
							.parent()
							.first()
							.within(() => {
								cy.contains(`button`, `Confirm`).as(`confirm`);
							});

						cy.get(`@confirm`).click();
						closePopup({ text: 'Ok' });
					});

					it(`Check no ${typeAccount} found for loan `, () => {
						clickOnLoanName(loanName);

						cy.wait(1000);

						cy.contains(`p`, `No ${typeAccount} found for this loan.`)
							.scrollIntoView()
							.should(`be.visible`);
					});
				}
			});
		});
	});
};

const checkUserInLoan = ({
	email = ``,
	userAccount,
	loanName,
	typeAccount,
}) => {
	describe(`Check borrower details in Loan`, () => {
		it(`Should login with lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		let accountUpdated;
		it(`Should get ${userAccount.email} account`, () => {
			getAccount(userAccount.email).then((foundAccount) => {
				accountUpdated = foundAccount;
			});

			cy.waitUntil(() => accountUpdated, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Should open loan by name "${loanName}"`, () => {
			closePopup({ wait: 3000 });
			clickOnLoanName(loanName);
		});

		if ([typeAccount].includes(`Borrower`)) {
			it(`Should open more information for "${loanName}"`, () => {
				cy.contains('p', `${accountUpdated.email}`)
					.parent()
					.parent()
					.parent()
					.parent()
					.parent()
					.parent()
					.parent()
					.first()
					.within(() => {
						cy.get(`button[aria-label="show more"]`).click();
					});
			});

			it(`Should check the data of ${typeAccount} "${userAccount.email}"`, () => {
				const arrOfDatasForCheck = [
					`${accountUpdated.email}`,
					`${accountUpdated.firstName}`,
					`${accountUpdated.lastName}`,
					`${accountUpdated.street1} ${accountUpdated.street2}`,
					`${accountUpdated.city}`,
					`${accountUpdated.state}`,
					`${accountUpdated.zipcode}`,
				];

				// for correct check "state"
				arrOfDatasForCheck.map((data) => {
					if (data === accountUpdated.state) {
						const insideBracketsPattern = data.match(/(\(.*?\))/g);

						if (insideBracketsPattern && insideBracketsPattern.length > 0) {
							data = insideBracketsPattern[0];
							data = data.replace('(', '');
							data = data.replace(')', '');
						}
					}

					cy.contains(`p`, data).scrollIntoView().should(`be.visible`);
				});
			});
		} else {
			it(`Should check the data of ${typeAccount} "${userAccount.email}"`, () => {
				const arrOfDatasForCheck = [
					`${accountUpdated.email}`,
					`${accountUpdated.firstName} ${accountUpdated.lastName}`,
				];

				arrOfDatasForCheck.map((data) => {
					cy.contains(`p`, data).scrollIntoView().should(`be.visible`);
				});
			});
		}
	});
};

const addTeamMember = ({
	lenderEmail,
	teamMemberAccount,
	checkLimit = false,
}) => {
	describe(`Add Team Member "${teamMemberAccount.email}"`, () => {
		it(`Should login with lender: ${lenderEmail}`, () => {
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.teamMembers} using the UI`, () => {
			navigate(appPaths.teamMembers);
		});

		if (checkLimit) {
			it(`Should click on "Add Team Member" using the UI`, () => {
				cy.contains(`button`, `Add Team Member`).should(`be.disabled`);
			});
		} else {
			it(`Should click on "Add Team Member" using the UI`, () => {
				cy.contains(`button`, `Add Team Member`)
					.should(`not.be.disabled`)
					.click();
			});

			it(`Should fill in Team Member details`, () => {
				fillFullNameEmail({
					user: teamMemberAccount,
					emailSelect: selectors.pageSignIn.emailInput,
				});
			});

			it(`Should click submit button and get message "User created successfully"`, () => {
				cy.contains('button', 'Submit').should('not.be.disabled').click();

				closePopup({ text: 'Confirm' });

				closePopup({ text: 'Ok' });
			});
			it(`Should save account details for testing`, () => {
				saveAccount(teamMemberAccount);

				exists('Notice', 5000).then(
					($isOneMoreLoan) => $isOneMoreLoan && closePopup({ text: 'Ok' })
				);
			});
		}
	});
};

const deleteTeamMember = ({ lenderEmail, teamMemberEmail }) => {
	describe(`Delete Team Member "${teamMemberEmail}"`, () => {
		it(`Should login with lender: ${lenderEmail}`, () => {
			cy.wait(1000);
			cy.reload();
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.teamMembers} using the UI`, () => {
			closePopup({ wait: 500 });
			navigate(appPaths.teamMembers);
		});

		it(`Delete "${teamMemberEmail}"`, () => {
			cy.wait(1000);
			cy.reload();
			cy.contains(`p`, `${teamMemberEmail}`)
				.parents(`tr`)
				.first()
				.within(() => {
					cy.contains(`button`, `Delete`).click();
				});

			cy.contains(`div`, `Are you sure to remove the teamMembers`)
				.parent()
				.first()
				.within(() => {
					cy.contains(`button`, `Confirm`).click();
				});

			cy.wait(3000);
			cy.reload();
		});

		it(`Сheck deleted "${teamMemberEmail}"`, () => {
			cy.get(`table`).should(`not.have.text`, `${teamMemberEmail}`);
		});
	});
};

const updateDueDateInLoan = ({ email, loanName }) => {
	describe(`Update Due Date in the Loan (${loanName})`, () => {
		it(`Should login with lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Should open loan by name "${loanName}" and go to "Payment History"`, () => {
			closePopup({ wait: 3000 });
			clickOnLoanName(loanName);
			cy.contains(`button`, `Payment History`).click();

			cy.get(`button#basic-menu`).click();
			cy.contains(`button`, `Update`).click();
		});
		// -------------------------- formatting date --------------------------
		// default data
		const day = `01`;
		const now = Date.now();

		// current date
		const currentMonth = new Date(now).getMonth();
		const currentYear = new Date(now).getFullYear();

		// next date
		const nextMonth = new Date(
			new Date(now).setMonth(new Date(now).getMonth()) // don't need to do "+ 1"
		);
		const nextYear = nextMonth.getFullYear();

		// formated date
		const currentDate = `${formatMonth(currentMonth)} ${day} ${currentYear}`;

		const nextDate = `${formatMonth(nextMonth.getMonth())} ${day} ${nextYear}`;
		// -------------------------- formatting date --------------------------

		it(`Formatting dates`, () => {
			cy.waitUntil(() => !!currentDate && !!nextDate, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Changing Due Date`, () => {
			cy.get(`div#dueDate`).should(`contain`, `${currentDate}`).as(`dueDate`);

			cy.get(`@dueDate`).click();

			cy.contains(`li`, `${nextDate}`).click();
			cy.contains(`button`, `Save`).click();

			closePopup({ text: 'Ok' });
		});

		it(`Should open loan by name "${loanName}" and go to "Payment History"`, () => {
			closePopup({ wait: 3000 });
			clickOnLoanName(loanName);
			cy.contains(`button`, `Payment History`).click();
		});

		it(`Checking changes must be(${nextDate})`, () => {
			cy.contains(`button`, `Update`).click();

			cy.get(`div#dueDate`).should(`contain`, `${nextDate}`);

			cy.contains(`button`, `Save`).click();
		});
	});
};

const removeBankAccount = ({ email, multiple = false }) => {
	describe(`Remove Bank Account`, () => {
		it(`Should login with lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
			navigate(appPaths.paymentMethods);
		});

		it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
			cy.reload();

			if (multiple) {
				cy.get('td button').each(($el, index, $list) => {
					cy.wrap($el).click();
					cy.contains(`p`, `Delete`).parents(`button`).click({ force: true });
					cy.wait(1000); ///sometimes it takes a while to delete
					closePopup({ wait: 1000, text: `Ok` });
				});
			} else {
				cy.get(`td button`).click();
				cy.contains(`p`, `Delete`).parents(`button`).click({ force: true });
				cy.wait(1000); ///sometimes it takes a while to delete
				closePopup({ wait: 1000, text: `Ok` });
			}

			cy.contains('td', 'No payment systems have been added.');
		});
	});
};

const forgotPassword = ({ email = '' }) => {
	describe(`Test "Forgot Password" for ${email}`, () => {
		it(`Logout any account`, () => {
			logout();
		});

		let account;
		it(`Should get lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				account = foundAccount;
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Click on "Forgot password?"`, () => {
			cy.contains(`a`, `Forgot password?`).click();
			cy.get(`input[name="email"]`).clear().type(email);

			cy.get(`button[type="submit"]`).click();

			closePopup({ text: 'Ok' });
		});

		let googleApiToken;
		it(`Should get googleApiToken using gmail API`, () => {
			cy.log('Logging in to Google Account');
			cy.request({
				method: 'POST',
				url: 'https://www.googleapis.com/oauth2/v4/token',
				body: {
					grant_type: 'refresh_token',
					client_id: Cypress.env('googleClientId'),
					client_secret: Cypress.env('googleClientSecret'),
					refresh_token: Cypress.env('googleRefreshToken'),
				},
			}).then(({ body }) => {
				googleApiToken = body;
			});
			cy.waitUntil(() => googleApiToken, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		let latestMessages;
		it(`Should get latest message from gmail inbox`, () => {
			cy.log('Give some time for email to be recieved.');
			cy.wait(4000); // Give some time for email to be recieved.

			const { access_token } = googleApiToken;

			const newer_than = '1h';
			const emailSender = Cypress.env('appEmailSender');
			const content = 'Your Land Loans Verification Code';
			const emailSubject = 'Your Land Loans Verification Code';
			const label = 'all'; // all, spam

			const query = encodeURIComponent(
				`${content} newer_than:${newer_than} from:${emailSender} to:${email} subject:${emailSubject} label:${label}`
			);

			cy.request({
				method: 'GET',
				url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env(
					'googleEmail'
				)}/messages?q=${query}`,
				headers: { Authorization: `Bearer ${access_token}` },
			}).then((response) => {
				latestMessages = response.body.messages; // sometimes we get more then 1 message
			});

			cy.waitUntil(() => latestMessages, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		let emailContents = [];
		it(`Get email content for latest message from gmail API`, () => {
			const { access_token } = googleApiToken;
			for (let i = 0; i < latestMessages.length; i++) {
				cy.request({
					method: 'GET',
					url: `https://gmail.googleapis.com/gmail/v1/users/${Cypress.env(
						'googleEmail'
					)}/messages/${latestMessages[i].id}?format=full`,
					headers: { Authorization: `Bearer ${access_token}` },
				}).then((response) => {
					let payload = response.body.payload;
					if (typeof payload.parts != 'undefined') {
						payload = payload.parts[0];
					}

					const encodedEmailContent = payload.body.data;

					if (encodedEmailContent) {
						const uint8array = Buffer.from(encodedEmailContent, 'base64');

						emailContents.push(new TextDecoder().decode(uint8array));
					}
				});
			}

			cy.waitUntil(() => emailContents.length > 0, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		const arrPatterns = ['Verification Code is '];
		let emailContent;
		let code;
		it('Should parse email, password, and reset link, then use it to update local cypress test account info.', () => {
			emailContent = emailContents.filter((letter) =>
				letter.includes('Verification Code is')
			)[0];

			emailContent = emailContent
				.replace(/(\r\n|\n|\r)/gm, '') //Remove all types of newline characters.
				.replace(/&gt;/g, '>') //sanatize
				.replace(/&lt;/g, '<')
				.replace(/&quot;/g, '"')
				.replace(/&apos;/g, "'")
				.replace(/&amp;/g, '&');

			const arrCode = arrPatterns.map((pattern) => {
				cy.log(pattern);
				return emailContent
					.substring(emailContent.match(pattern).index + pattern.length)
					.split(' ')[0];
			});
			code = arrCode.join('');

			cy.waitUntil(() => arrCode.length > 0, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Fill filds for new password`, () => {
			code = code.replaceAll(/[^0-9]/g, ''); // replace only numbers

			const newPassword = generatePassword(12, 1, 1, 1);

			cy.get(`input[name="confirmationCode"]`).clear().type(code);
			cy.get(`input[name="password"]`).clear().type(newPassword);

			account.password = newPassword;

			cy.get(`button[type="submit"]`).click();
			closePopup({ text: 'Ok' });
		});

		it(`Save account with new password`, () => {
			saveAccount(account);
		});

		it(`Should get lender, login and check URL: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});

			cy.url().should('include', appPaths.dashboard);
		});
	});
};

const refreshLoanCalculations = ({ loanName }) => {
	describe(`Refresh Loan Calculations`, () => {
		it(`Should open loan popup`, () => {
			cy.reload();
			closePopup({ wait: 1000 });
			clickOnLoanName(loanName);
		});

		it(`Check notify`, () => {
			cy.contains(
				`h6`,
				`This is a Draft. Update Loan Status to Active when ready to use`
			).should(`be.visible`);
			cy.contains(`button`, `Refresh Loan Calculations`).click();
		});
	});
};

const firstLogin = ({ email, countClicks }) => {
	describe(`Refresh Loan Calculations`, () => {
		it(`Logout any account`, () => {
			logout();
		});

		for (let i = 0; i < countClicks; i++) {
			it(`Should test "First Login" ${i + 1}`, () => {
				cy.contains(`a`, `First Login?`).click();
				cy.get(`input#inviteEmail`).clear().type(email);

				cy.contains(`button`, `Send`).click();
				closePopup({ text: 'Ok' });
			});
		}
	});
};

const searchField = ({ loanName, status, balance, days }) => {
	describe(`Search field`, () => {
		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Checking correct result`, () => {
			cy.reload();

			const arrForCheck = [];

			if (loanName) arrForCheck.push(loanName);
			if (status) arrForCheck.push(status);
			if (balance) arrForCheck.push(balance);
			if (days) arrForCheck.push(balance / days);

			for (let i = 0; i < arrForCheck.length; i++) {
				if (!isNaN(arrForCheck[i])) {
					arrForCheck[i] = arrForCheck[i].toLocaleString('en-IN');
				}

				cy.get(`input[placeholder="Search Property..."]`)
					.clear()
					.type(arrForCheck[i]);

				cy.get(`tbody tr`)
					.should(`have.length`, 1)
					.and(`contain`, arrForCheck[i]);
			}
		});
	});
};

const resendInvite = ({ email, loanName, countResendeClicks, whoom }) => {
	describe(`Resend Invite for ${email}`, () => {
		it(`Should get lender: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			acceptPopup({ role: whoom });

			navigate(appPaths.allLoans);
		});

		for (let i = 0; i < countResendeClicks; i++) {
			it(`Should open loan popup and click (${i + 1})`, () => {
				cy.reload();

				// need open => close => open for updating info(only for current testing)
				clickOnLoanName(loanName);
				closePopup();
				clickOnLoanName(loanName);

				cy.contains(`Resend Invite`)
					.scrollIntoView()
					.should(`not.be.disabled`)
					.click();
			});
		}
	});
};

const uploadDocumentForLoan = ({ email, loanName, addOnlyOne = false }) => {
	describe(`Upload Document For Loan "${loanName}"`, () => {
		it(`Should login: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Should open loan popup`, () => {
			clickOnLoanName(loanName);
		});

		// hardcoded name of test file for upoloading
		const arrNameOfFiles = [`test-document-upload-fail.png`];

		if (!addOnlyOne) {
			arrNameOfFiles.push(
				`test-document-upload-success.png`,
				`test-document-upload-success_3.png`,
				`test-document-upload-success_4.png`,
				`test-document-upload-success_5.png`
			);
		}

		const downloadsFolder = Cypress.config('downloadsFolder');

		for (let i = 0; i < arrNameOfFiles.length; i++) {
			it(`Should upload file "${arrNameOfFiles[i]}"`, () => {
				closePopup({ wait: 8000 }); // time for uploading file
				cy.contains(loanName).click();

				cy.get('input#file[type=file]').selectFile(
					`cypress/fixtures/${arrNameOfFiles[i]}`,
					{
						force: true,
					}
				);

				cy.contains(`Add Document`).should(`not.be.disabled`).click();
			});
		}

		if (!addOnlyOne) {
			it(`Should be disabled (5/5)`, () => {
				closePopup({ wait: 2500 });
				cy.reload();
				closePopup({ wait: 5500 });

				cy.contains(loanName).click();

				cy.get('input#file[type=file]').should(`be.disabled`);
			});

			for (let i = 0; i < arrNameOfFiles.length; i++) {
				it(`Should check ${i > 0 ? 'Remove' : 'Download'} => ${
					arrNameOfFiles[i]
				}`, () => {
					cy.reload();
					closePopup({ wait: 5000 });
					cy.contains(loanName).click();

					cy.contains(`p`, `${arrNameOfFiles[i]}`)
						.parent()
						.parent()
						.first()
						.within(() => {
							if (i > 0) {
								cy.contains(`Remove Document`).scrollIntoView().click();
								cy.reload();
							} else {
								cy.contains(`Download Document`).scrollIntoView().click();

								cy.readFile(
									path.join(downloadsFolder, arrNameOfFiles[i])
								).should('exist');
							}
						});
				});
			}
		}
	});
};

const checkAccessibility = ({ forStatus, loanName }) => {
	describe(`Check Accessibility for "${forStatus}"`, () => {
		// Rules
		let canMakePayment;
		let canAddBorrower;
		let canAddPartner;
		let canAddDoc;

		// Manage list
		let canAddOneTimeFee;
		let canRemoveOneTimeFee;
		let canAddLateFee;
		let canRemoveLateFee;
		let canAddRemoveFees;

		let isNotChecking;

		let canEditLoan;
		let canDownloadLoanData;

		let canEditDueDate;

		switch (forStatus) {
			case `Active`:
				canMakePayment = true;
				canAddBorrower = true;
				canAddPartner = true;
				canAddDoc = true;

				// Manage list
				isNotChecking = false;

				canAddOneTimeFee = true;
				canRemoveOneTimeFee = true;
				canAddLateFee = true;
				canRemoveLateFee = true;
				canAddRemoveFees = true;

				canEditLoan = true;
				canDownloadLoanData = true;

				canEditDueDate = true;
				break;

			case `Frozen`:
				canMakePayment = false;
				canAddBorrower = false;
				canAddPartner = false;
				canAddDoc = false;

				// Manage list
				isNotChecking = true;

				canAddOneTimeFee = false;
				canRemoveOneTimeFee = false;
				canAddLateFee = false;
				canRemoveLateFee = false;

				canAddRemoveFees = false;

				canEditLoan = true;
				canDownloadLoanData = false;

				canEditDueDate = false;
				break;

			case `PaidOff`:
				canMakePayment = true;
				canAddBorrower = true;
				canAddPartner = true;
				canAddDoc = true;

				// Manage list
				isNotChecking = false;

				canAddOneTimeFee = true;
				canRemoveOneTimeFee = true;
				canAddLateFee = true;
				canRemoveLateFee = true;

				canAddRemoveFees = true;
				canEditLoan = true;
				canDownloadLoanData = true;

				canEditDueDate = true;
				break;

			case `Cancelled`:
				canMakePayment = false;
				canAddBorrower = false;
				canAddPartner = false;
				canAddDoc = false;

				// Manage list
				isNotChecking = true;

				canAddOneTimeFee = false;
				canRemoveOneTimeFee = false;
				canAddLateFee = false;
				canRemoveLateFee = false;

				canAddRemoveFees = false;
				canEditLoan = true;
				canDownloadLoanData = false;

				canEditDueDate = false;
				break;

			default:
				break;
		}

		it(`Should nav to ${appPaths.loansRecordPayment} using the UI`, () => {
			navigate(appPaths.loansRecordPayment);
		});

		it(`Button "Review Payment Details" should be ${
			canMakePayment ? 'enabled' : 'disabled'
		}`, () => {
			canMakePayment
				? cy
						.contains(`button`, `Review Payment Details`)
						.scrollIntoView()
						.should(`not.be.disabled`)
				: cy
						.contains(`button`, `Review Payment Details`)
						.scrollIntoView()
						.should(`be.disabled`);
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Make payment in the Loan "${loanName}" must be ${
			canMakePayment ? 'enabled' : 'disabled'
		}`, () => {
			clickOnLoanName(loanName);

			canMakePayment
				? cy
						.contains('a', 'Record Payment')
						.scrollIntoView()
						.should('not.have.attr', 'aria-disabled')
				: cy
						.contains('a', 'Record Payment')
						.scrollIntoView()
						.should('have.attr', 'aria-disabled', 'true');
		});

		// Add Borrower, Partner and check for Manage list
		const arrAccessibilityData = [
			{
				title: `Add Borrower`,
				accsess: canAddBorrower,
				isManage: false,
				isPopup: true,
			},
			{
				title: `Add Partner`,
				accsess: canAddPartner,
				isManage: false,
				isPopup: true,
			},
			{
				title: `Add One Time Fee`,
				accsess: canAddOneTimeFee,
				isManage: true,
				isPopup: true,
				isNotChecking: isNotChecking,
			},
			{
				title: `Remove One Time Fee`,
				accsess: canRemoveOneTimeFee,
				isManage: true,
				isPopup: true,
				isNotChecking: isNotChecking,
			},
			{
				title: `Add Late Fee`,
				accsess: canAddLateFee,
				isManage: true,
				isPopup: true,
				isNotChecking: isNotChecking,
			},
			{
				title: `Remove Late Fee`,
				accsess: canRemoveLateFee,
				isManage: true,
				isPopup: true,
				isNotChecking: isNotChecking,
			},
			{
				title: `Add/Remove Fees`,
				accsess: canAddRemoveFees,
				isManage: true,
				isPopup: false,
			},

			{
				title: `Edit Loan`,
				accsess: canEditLoan,
				isManage: true,
				isPopup: false,
			},
			{
				title: `Download Loan Data`,
				accsess: canDownloadLoanData,
				isManage: true,
				isPopup: false,
			},
		];

		arrAccessibilityData.map((el) => {
			if (el.isManage) {
				it(`Check button ${el.title} in Manage list`, () => {
					cy.contains('button', 'Manage').click({ force: true });

					if (el.isNotChecking) return;

					if (el.isPopup) cy.contains('li', 'Add/Remove Fees').click();

					el.accsess
						? cy
								.contains(`${el.title}`)
								.scrollIntoView()
								.should('not.have.attr', 'aria-disabled')
						: cy
								.contains(`${el.title}`)
								.scrollIntoView()
								.should('have.attr', 'aria-disabled', 'true');

					cy.contains('button', 'Manage').click({ force: true });
				});
			} else {
				it(`Button "${el.title}" should be ${
					el.accsess ? 'enabled' : 'disabled'
				}`, () => {
					el.accsess
						? cy
								.contains(`button`, `${el.title}`)
								.scrollIntoView()
								.should(`not.be.disabled`)
						: cy
								.contains(`button`, `${el.title}`)
								.scrollIntoView()
								.should(`be.disabled`);
				});
			}
		});

		// Add File
		it(`Button "Add Document(Choose file)" should be ${
			canAddDoc ? 'enabled' : 'disabled'
		}`, () => {
			canAddDoc
				? cy
						.get('input#file[type=file]')
						.scrollIntoView()
						.should(`not.be.disabled`)
				: cy
						.get('input#file[type=file]')
						.scrollIntoView()
						.should(`be.disabled`);
		});

		it(`Should open loan by name "${loanName}" and go to "Payment History"`, () => {
			closePopup({ wait: 3000 });
			clickOnLoanName(loanName);
			cy.contains(`button`, `Payment History`).click();
		});
	});
};

const changePlanLevelTo = ({ lenderAccount, toPlan }) => {
	describe(`Change Plan Level to ${toPlan}`, () => {
		let account;
		it('Should login with lender account', () => {
			getAccount(lenderAccount.email).then((foundAccount) => {
				account = foundAccount;
				expect(account).to.have.property('password');
				expect(account.password).not.to.be.empty;
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.billing} using the UI`, () => {
			exists('Notice', 5000).then(
				($isOneMoreLoan) => $isOneMoreLoan && closePopup({ text: 'Ok' })
			);

			navigate(appPaths.billing);
		});

		it(`Change to plan ${toPlan}`, () => {
			cy.contains('button', 'Edit Plan Level').click();

			cy.contains('h2', 'Select the plan level')
				.parents('form')
				.first()
				.within(() => {
					cy.get('div#planLevel').click();
				});

			cy.get('ul')
				.last()
				.within(() => {
					cy.contains('li', `${toPlan}`).click();
				});

			cy.contains('button', 'Ok').click();

			cy.contains('h2', 'Confirmation !')
				.parent()
				.first()
				.as('popupConfirmation');

			cy.contains('button', 'Confirm').click();

			closePopup({ text: 'Ok' });
		});
	});
};

const duplicateExistingLoan = ({ email = '', loanName }) => {
	describe(`Duplicate Existing Loan (${loanName})`, () => {
		it(`Should login: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.addNewLoan} using the UI`, () => {
			navigate(appPaths.addNewLoan);
		});

		it(`Should click on "Duplicate" button loan "${loanName}" `, () => {
			cy.contains(`button`, `Duplicate Existing Loan`).click();

			cy.contains(loanName).should('have.length', 1).click();

			cy.get(`input#name[name='name']`).clear().type(`${loanName}${duplicate}`);

			cy.contains('button', 'Create Loan').click();
		});

		it(`Should nav to ${appPaths.allLoans} using the UI`, () => {
			closePopup({ text: 'Ok' });
			navigate(appPaths.allLoans);
		});

		it(`Checking loans`, () => {
			cy.get(`tbody tr`)
				.should(`have.length`, 2)
				.and(`contain`, `${loanName}${duplicate}`)
				.and(`contain`, `${loanName}`);
		});
	});
};

const deleteSchedulePayment = ({ email, loanName }) => {
	describe(`Delete Schedule Payment for loan (${loanName})`, () => {
		it(`Should login: ${email}`, () => {
			getAccount(email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.addNewLoan} using the UI`, () => {
			navigate(appPaths.allLoans);
		});

		it(`Should open loan popup`, () => {
			closePopup();
			cy.contains(loanName).click();
		});

		it(`Should nav to "Scheduled Payments"`, () => {
			cy.contains(`button`, `Scheduled Payments`).click();
			cy.get(`tbody tr td`)
				.last()
				.within(() => {
					cy.get(`button`).click();
				});

			cy.get(`ul[role="menu"]`)
				.last()
				.within(() => {
					cy.contains(`li`, 'Delete').as(`liDelete`);
				});

			cy.get(`@liDelete`).click({ force: true });
			closePopup({ text: 'Ok' });
		});
	});
};

const accountPreferences = ({ loan }) => {
	describe(`Account Preferences`, () => {
		it(`Should nav to ${appPaths.accountPreferences} using the UI`, () => {
			navigate(appPaths.accountPreferences);
		});

		it(`Should fill out form fields`, () => {
			loan = {
				...loan,
				interestRate: '1.23',
				daysInterestMethod: '365',
				daysBeforeDefault: '123',
				lateFeeType: 'Flat',
				lateFeeAmountA: '123',
				gracePeriod: '123',
				achFlatFee: '1.23',
				achPercentage: '1.23',
				creditCardFlatFee: '3.21',
				creditCardPercentage: '3.21',
				additionalFees: [
					{
						name: 'Update 123',
						charge: '123',
					},
				],
			};

			for (let field in loan) {
				if (
					[
						`state`,
						`county`,
						`parcelNumbers`,
						`name`,
						`salePrice`,
						`financedAmount`,
						`numberOfPayments`,
						`interestStartDate`,
						`paymentStartDate`,
						`loanOriginationDate`,
					].includes(field)
				) {
					continue;
				}

				cy.log(`Filling in field: **${field}**`);
				let formField = loanForm[field];
				let fieldValue = loan[field];

				fillFiled({
					type: formField.type,
					selector: formField.selector,
					value: fieldValue,
					content: formField.content,
				});
			}
		});

		it(`Should updated preferences`, () => {
			cy.contains(`button`, `Update Account Preferences`).click();
			closePopup({ text: 'Ok' });
		});

		it(`Should nav to ${appPaths.accountPreferences} using the UI`, () => {
			navigate(appPaths.addNewLoan);
		});

		it(`Should check preferences when adding loan`, () => {
			for (let field in loan) {
				if (
					[
						`state`,
						`county`,
						`parcelNumbers`,
						`name`,
						`salePrice`,
						`financedAmount`,
						`numberOfPayments`,
						`interestStartDate`,
						`paymentStartDate`,
						`loanOriginationDate`,
					].includes(field)
				) {
					continue;
				}

				cy.log(`Checking in field: **${field}**`);
				let formField = loanForm[field];
				let fieldValue = loan[field];

				checkFiled({
					type: formField.type,
					selector: formField.selector,
					value: fieldValue,
					content: formField.content,
				});
			}
		});

		it(`Should nav to ${appPaths.accountPreferences} using the UI`, () => {
			navigate(appPaths.accountPreferences);
		});

		it(`Should remove preferences "Clear"`, () => {
			cy.contains(`button`, `Clear`).last().click();
			closePopup({ text: 'Ok' });
		});

		it(`Should remove preferences "Remove Account Preferences"`, () => {
			cy.contains(`button`, `Remove Account Preferences`).click();
			closePopup({ text: 'Ok' });
		});

		it(`Should nav to ${appPaths.accountPreferences} using the UI`, () => {
			navigate(appPaths.addNewLoan);
		});

		it(`Should check preferences when adding loan`, () => {
			loan = {
				...loan,
				interestRate: '',
				daysInterestMethod: '360',
				daysBeforeDefault: '',
				lateFeeType: 'Flat',
				lateFeeAmountA: '',
				gracePeriod: '',
				achFlatFee: '',
				achPercentage: '',
				creditCardFlatFee: '',
				creditCardPercentage: '',
				additionalFees: [
					{
						name: '',
						charge: '',
					},
				],
			};

			for (let field in loan) {
				if (
					[
						`state`,
						`county`,
						`parcelNumbers`,
						`name`,
						`salePrice`,
						`financedAmount`,
						`numberOfPayments`,
						`interestStartDate`,
						`paymentStartDate`,
						`loanOriginationDate`,
					].includes(field)
				) {
					continue;
				}

				cy.log(`Checking in field: **${field}**`);
				let formField = loanForm[field];
				let fieldValue = loan[field];

				checkFiled({
					type: formField.type,
					selector: formField.selector,
					value: fieldValue,
					content: formField.content,
				});
			}
		});
	});
};

const addCreditCardAccount = ({ isBorrower = false }) => {
	describe(`Add Credit Card Account to ${
		isBorrower ? 'Borrower' : 'Lender'
	}`, () => {
		const apiLoginId = Cypress.env('apiLoginId');
		const transactionKey = Cypress.env('transactionKey');

		it(`Should nav to ${appPaths.paymentMethods} using the UI (apiLoginId: ${apiLoginId} | transactionKey: ${transactionKey})`, () => {
			cy.log(`apiLoginId: ${apiLoginId}`);
			cy.log(`transactionKey: ${transactionKey}`);
			navigate(appPaths.paymentMethods);

			cy.contains('a', 'New Payment Method').click();

			cy.log('Click on "Credit Card" button');
			cy.get('button[data-cy="credit_card"]').click();

			cy.url().then((url) => {
				cy.log('Current URL is: ' + url);
			});
		});

		it(`Should add "Credit Card Account"`, () => {
			exists('Notice', 5000).then(
				($isOneMoreLoan) => $isOneMoreLoan && closePopup({ text: 'Ok' })
			);

			if (isBorrower) {
				cy.frameLoaded('[name="output_frame"]');

				cy.iframe('[name="output_frame"]').as('paymentFrame');

				cy.get('@paymentFrame')
					.first()
					.within(() => {
						cy.get(`a[id="lnkPaymentAdd"]`).click(); // Add a New Payment Method

						// https://developer.authorize.net/hello_world/testing_guide.html
						cy.get('input[name="cardNum"]').clear().type('370000000000002');
						cy.get('input[name="expiryDate"]').clear().type('1299');
						cy.get('input[name="cvv"]').clear().type('900');

						cy.get('input[name="firstName"]').clear().type('Yevhen');
						cy.get('input[name="lastName"]').clear().type('Semeniuk');

						cy.get('input[name="zip"]').clear().type('900');
						cy.get('input[name="address"]')
							.clear()
							.type('street Budivelykiv 30');

						cy.get('input[name="city"]').clear().type('Kyiv');
						cy.get('input[name="state"]').clear().type('Kyivsiy region');
						cy.get('input[name="phoneNumber"]').clear().type('380931234567');

						cy.get('input[name="companyName"]').clear().type('ITeam');
						cy.get('button[id="saveButton"]').click();
					});

				cy.wait(5000);
				cy.contains('button', 'Close').click();

				cy.contains('Payment Methods').click();
				cy.reload();
				cy.url().should('include', appPaths.paymentMethods);

				cy.contains('AmericanExpress (0002)').should('be.visible');
				cy.contains('Verified').should('be.visible');
			} else {
				cy.log('Try find "Create Account" button');
				cy.get('button[data-cy="create_your_account"]')
					.should('be.visible')
					.as('btnCreateAccount');
				cy.get('@btnCreateAccount').first().click({ force: true });

				cy.log('Check correct url');
				cy.url().should('include', appPaths.creditCard);

				cy.log('Fill out form');
				cy.get('input#apiLoginId').clear().type(apiLoginId);
				cy.get('input#transactionKey').clear().type(transactionKey);

				cy.log('Create account');
				cy.contains('button', 'Create Credit Card Account').click();

				cy.log(`Should check "Credit Card Account"`);
				navigate(appPaths.paymentMethods);
				cy.contains('New Payment Method').click();

				cy.contains('div', '(Account Connected)')
					.should('have.css', 'color', 'rgb(255, 0, 0)') // rgb(255, 0, 0) - red
					.and('be.visible');

				cy.log('Skip cy bug with redirect to "Loans" page');
				cy.contains('Loans').click();
				cy.contains('Add New Loan').click();
				cy.contains('Loans').click();
			}
		});
	});
};

const cancelACHPayment = ({
	account,
	isLender = true,
	loanName,
	amount,
	transactionFees = 0,
}) => {
	describe(`Cancel ACH Payment`, () => {
		it(`Should login: ${account.email}`, () => {
			getAccount(account.email).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should nav to ${appPaths.paymentMethods} using the UI`, () => {
			closePopup();

			if (isLender) {
				navigate(appPaths.allLoans);
			} else {
				cy.contains('Loan').click();
			}
		});

		it(`Open loan by name(${loanName})`, () => {
			clickOnLoanName(loanName);

			cy.contains(`button`, `Payment History`).click();
		});

		it(`Confirm canceling (${loanName} with amount ${+amount} + ${transactionFees})`, () => {
			cy.contains(`p`, formatterNum.format(+amount + +transactionFees))
				.parents(`tr`)
				.as(`row`);

			cy.get(`@row`).within(() => {
				cy.contains(`button`, `Cancel`).click();
			});

			cy.contains(`button`, `Confirm`).click();
			closePopup({ text: 'Ok' });

			closePopup({ wait: 3000 });

			clickOnLoanName(loanName);

			cy.contains(`button`, `Payment History`).click();

			cy.get(`@row`).within(() => {
				cy.contains(`p`, `Cancelled`).should(`be.visible`);
			});
		});
	});
};

const verifyMicroDeposits = () => {
	describe(`Verify micro-deposits on the back-end part`, () => {
		let isVerified = false;
		it(`Should navigate to ${appPaths.paymentMethods} using the UI`, () => {
			cy.log(`Check button`);
			exists('Go to Payment Methods', 5000).then(($isOneMoreLoan) => {
				cy.log(`Click button`);
				$isOneMoreLoan && closePopup({ text: 'Go to Payment Methods' });
			});

			containsText('button', 'Go to Payment Methods', 5000).then(
				($isOneMoreLoan) => {
					cy.log(`Click button`);
					$isOneMoreLoan && closePopup({ text: 'Go to Payment Methods' });
				}
			);

			navigate(appPaths.paymentMethods);
		});

		it(`Should send request for verify`, () => {
			cy.log(`Waiting => 2m`);
			cy.wait(120000);

			cy.log(`Sending request...`);
			cy.request(
				'https://ibvycg9i0a.execute-api.us-west-2.amazonaws.com/dev/util/process-plaid-sandbox-micro-deposits'
			).then(({ body }) => {
				console.log('resp', body.message);
				cy.log(`=> ${body.message} <=`);
				isVerified = true;
			});
			cy.log(`Sended request.`);

			cy.waitUntil(() => !!isVerified, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});

			isVerified = false;

			cy.log(`Waiting => 2m`);
			cy.wait(120000);
			cy.reload();

			cy.log(`Click on "Verify" button`);
			cy.contains('span', 'Verified')
				.should('not.be.disabled')
				.click({ force: true });
		});

		it(`Plaid steps`, () => {
			cy.frameLoaded('[title="Plaid Link"]');

			cy.iframe('[title="Plaid Link"]').as('paymentFrame');

			cy.log(`Hello iFrame`);
			cy.get('@paymentFrame')
				.first()
				.within(() => {
					cy.get('input#nonce-input')
						.clear()
						.type(bankAccounts.sameDayMicroDepositsPlaid.depositCode);

					cy.contains('Continue').click();

					cy.contains('Continue').click();
				});

			closePopup({ text: 'Ok' });
		});
	});
};

// Payment Sharing Summary
const addPaymentSharingSummary = ({
	lenderEmail,
	amountPercentage,
	firstPositionAmount,
	arrEmails,
}) => {
	describe(`Add "Payment Sharing Summary"`, () => {
		it(`Should login: ${lenderEmail}`, () => {
			getAccount(lenderEmail).then((foundAccount) => {
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});
		});

		it(`Should navigate to ${appPaths.paymentMethods} using the UI`, () => {
			navigate(appPaths.paymentSharingSummary);
		});

		arrEmails.map((email) => {
			it(`Should add "Payment Sharing" for ${email}`, () => {
				cy.contains('button', 'Add Payment Sharing').click({ force: true });
				cy.contains('button', 'Add Payment Sharing').click({ force: true });

				cy.get('div[id="userId"]').click();

				cy.contains('li', `${email}`).click();

				cy.get('input[id="percentagePortion"]').clear().type(amountPercentage);

				cy.contains('button', 'Submit').click();

				closePopup({ text: 'Ok' });
			});
		});

		it(`Should add "First Position" for ${arrEmails[0]}`, () => {
			cy.contains('button', 'Add First Position').click({ force: true });

			cy.get('div[id="userId"]').click();
			cy.contains('li', `${arrEmails[0]}`).click();

			cy.get('input[id="amount"]').clear().type(firstPositionAmount);

			cy.contains('button', 'Submit').click();

			closePopup({ text: 'Ok' });
		});
	});
};

const checkPaymentSharingSummary = ({
	amountPercentage,
	firstPositionAmount,
	arrEmails,
}) => {
	describe(`Check "Payment Sharing Summary"`, () => {
		arrEmails.map((email) => {
			it(`Should check "Payment Sharing" for ${email}`, () => {
				cy.log('Check "Payment Sharing"');
				cy.get('table')
					.first()
					.within(() => {
						cy.contains('p', `${email}`).should('be.visible');
						cy.contains('p', `${email}`).should('be.visible').as('email');
						cy.get('@email')
							.parents('tr')
							.first()
							.within(() => {
								cy.contains('p', `${amountPercentage}%`).should('be.visible');
							});
					});
			});
		});

		it(`Should check "First Position" for ${arrEmails[0]}`, () => {
			cy.log('Check "First Position"');
			cy.contains('h4', 'First Position')
				.parent()
				.within(() => {
					cy.contains('p', `${arrEmails[0]}`).should('be.visible').as('email');

					cy.get('@email')
						.parents('tr')
						.first()
						.within(() => {
							cy.contains('p', `$${firstPositionAmount}.00`).should(
								'be.visible'
							);
						});
				});
		});
	});
};

const updatePaymentSharingSummary = ({
	amountPercentage,
	firstPositionAmount,
	arrEmails,
}) => {
	describe(`Update "Payment Sharing Summary"`, () => {
		arrEmails.map((email) => {
			it(`Should check "Payment Sharing" for ${email}`, () => {
				cy.log('Check "Payment Sharing"');
				cy.get('table')
					.first()
					.within(() => {
						cy.contains('p', `${email}`)
							.parents('tr')
							.within(() => {
								cy.contains('button', 'Edit').click();
							});
					});

				cy.get('input[id="percentagePortion"]').clear().type(amountPercentage);
				cy.contains('button', 'Submit').click();

				closePopup({ text: 'Ok' });
			});
		});

		it(`Should check "First Position" for ${arrEmails[0]}`, () => {
			cy.log('Check "First Position"');
			cy.contains('h4', 'First Position')
				.parent()
				.within(() => {
					cy.contains('p', `${arrEmails[0]}`)
						.parents('tr')
						.within(() => {
							cy.contains('button', 'Edit').click();
						});
				});

			cy.get('input[id="amount"]').clear().type(firstPositionAmount);
			cy.contains('button', 'update').click();

			closePopup({ text: 'Ok' });
		});
	});
};

const removePaymentSharingSummary = ({ arrEmails }) => {
	describe(`Update "Payment Sharing Summary"`, () => {
		arrEmails.map((email) => {
			it(`Should check "Payment Sharing" for ${email}`, () => {
				cy.log('Check "Payment Sharing"');
				cy.get('table')
					.first()
					.within(() => {
						cy.contains('p', `${email}`)
							.parents('tr')
							.within(() => {
								cy.contains('button', 'Delete').click();
							});
					});

				closePopup({ text: 'Ok' });
			});
		});

		it(`Should check "Payment Sharing" for ${arrEmails[0]}`, () => {
			cy.contains('td', 'Not Enable Payment Sharing').should('be.visible');
		});

		it(`Should check "First Position" for ${arrEmails[0]}`, () => {
			cy.log('Check "First Position"');
			cy.contains('h4', 'First Position')
				.parent()
				.within(() => {
					cy.contains('p', `${arrEmails[0]}`)
						.parents('tr')
						.within(() => {
							cy.contains('button', 'Delete').click();
						});
				});

			closePopup({ text: 'Ok' });
		});
	});
};

const addBorrowerAssist = ({ email, borrower }) => {
	const countAssistReq = [1, 2];
	const checkArray = [
		{
			text: 'Approve',
			checkText: 'Approved',
		},
		{
			text: 'Reject',
			checkText: 'Rejected',
		},
	];

	describe(`Add Borrower Assist`, () => {
		let account;
		it('Should login with lender account', () => {
			getAccount(email).then((foundAccount) => {
				account = foundAccount;
				expect(account).to.have.property('password');
				expect(account.password).not.to.be.empty;

				login({ account: foundAccount });
			});

			cy.waitUntil(() => account, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		countAssistReq.map(() => {
			it(`Should nav to ${appPaths.addBorrowerAssit} using the UI`, () => {
				navigate(appPaths.addBorrowerAssit);
			});

			it(`Should make borrower assist Payment`, () => {
				cy.contains('h4', 'Make a Payment').parent().click();

				const bankAccount =
					account.bankAccounts[
						Object.keys(account.bankAccounts)[
							Object.keys(account.bankAccounts).length - 1
						]
					];

				cy.contains('Select Bank Account').parent().click();

				cy.contains('button', 'Review Payment Details').click();

				cy.get('form').submit();
				closePopup({ text: 'Ok' });
			});

			it(`Should check that borrower assistance request exist`, () => {
				cy.contains('p', `${borrower.firstName} ${borrower.lastName}`);
				cy.get('span').contains('Pending', { matchCase: false });
			});
		});

		let borrowerAccount;
		it(`Should login with: ${borrower.email}`, () => {
			getAccount(borrower.email).then((foundAccount) => {
				borrowerAccount = foundAccount;
				expect(foundAccount).to.have.property('password');
				expect(foundAccount.password).not.to.be.empty;

				login({ account: foundAccount });
			});

			cy.waitUntil(() => borrowerAccount, {
				timeout: Cypress.config('defaultCommandTimeout'),
			});
		});

		it(`Should nav to ${appPaths.addBorrowerAssit} using the UI`, () => {
			closePopup();
			navigate(appPaths.assistanceRequests);
		});

		checkArray.map(({ text, checkText }) => {
			it(`Should ${text} the assistance request`, () => {
				cy.contains('button', text).first().click();

				closePopup({ text: 'Ok' });

				cy.contains('span', checkText);
				cy.reload();
			});
		});
	});
};

const checktagsInLoan = ({ tags = [], loan }) => {
	describe(`Should check if tags exist in all places`, () => {
		it(`Should nav to ${appPaths.allLoans} with UI`, () => {
			navigate(appPaths.allLoans);
		});

		tags.forEach((tag) => {
			it(`Should check if ${tag} exist`, () => {
				cy.contains('span', `${tag}`);
				cy.contains('h6', `${loan.name}`).parent().parent().click();
				cy.contains('p', `${tag}`);
				cy.contains('h6', 'Tags').parent().last().click();

				closePopup({ text: 'Confirm' });

				closePopup({ text: 'Close' });
			});
		});
	});
};
/// To DO: should add logic to delete all tags
const deleteAndAddTagsInLoanDetails = (tags) => {
	describe(`Should delete all tags in loan`, () => {
		it(`Should nav to ${appPaths.allLoans} with UI`, () => {
			navigate(appPaths.allLoans);
		});

		it('Should open loan details and tags popup', () => {
			cy.get('table').click();
		});

		it('Should delete first tag', () => {
			cy.contains('h6', 'Tags').parent().children().last().click();
			cy.contains('span', `${tags[0]}`).next('svg').click();

			closePopup({ text: 'Confirm' });
		});

		it('Should add tags in loan detail', () => {
			cy.contains('button', 'Add Tags').click();
			tags.forEach((tag) => {
				cy.get('input#tags').focus().type();
			});

			closePopup({ text: 'Close' });
		});
	});
};

export default {
	deleteAndAddTagsInLoanDetails,
	createNewLoan,
	cleanUpLoans,
	deleteLoan,
	deleteAllLoans,
	deletePaymentMethod,
	addBorrowerToLoanDetails,
	addBorrower,
	acceptEmailInvite,
	setupPaymentAccount,
	verifyPaymentAccount,
	makePayment,
	makeManualPayment,
	checkAllLinks,
	checkAddLenderValidation,
	addLender,
	getInformationLoan,
	reviewLoanDetails,
	changePlanLevel,
	dwollaSignup,
	makeMultiplePayments,
	manageFees,
	removeFee,
	lateFee,
	editFees,
	changingLoanStatus,
	checkChanges,
	downloanLoanData,
	dataToJSON,
	createRecordPayment,
	updateRecordPayment,
	deleteRecordPayment,
	schedulePayment,
	compareSchedulePayment,
	editeSchedulePayment,
	editeProfile,
	checkProfileAfterEdite,
	addBankForBorrower,
	checkPaymentMethod,
	checkEmails,
	addPartner,
	removeUserFromLoan,
	checkUserInLoan,
	addTeamMember,
	deleteTeamMember,
	updateDueDateInLoan,
	removeBankAccount,
	forgotPassword,
	refreshLoanCalculations,
	firstLogin,
	searchField,
	resendInvite,
	uploadDocumentForLoan,
	checkAccessibility,
	changePlanLevelTo,
	duplicateExistingLoan,
	deleteSchedulePayment,
	accountPreferences,
	addCreditCardAccount,
	cancelACHPayment,
	editLoan,
	checkFieldOnLoanPage,
	deleteLoanField,
	verifyMicroDeposits,
	addPaymentSharingSummary,
	checkPaymentSharingSummary,
	updatePaymentSharingSummary,
	removePaymentSharingSummary,
	addBorrowerAssist,
	checktagsInLoan,
};
