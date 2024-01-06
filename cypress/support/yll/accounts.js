import { randomString, copyObject } from '/cypress/support/yll/util';
import loans from '/cypress/support/yll/loans';

// Lender
const newLenderAccount = {
	email: Cypress.env('googleEmail').replace('@', `+lender_${randomString()}@`),
	firstName: `Name_${randomString()}`,
	lastName: `LastName_${randomString()}`,
	businessName: `BusinessName_${randomString()}`,
	businessPublicName: `BusinessPublicName_${randomString()}`,
	street1: '6402 24th Ave',
	street2: '-',
	city: 'Brooklyn',
	state: 'New York (NY)',
	zipcode: '11204',
	publicContactEmail: `yourlandloans+pub_${randomString()}@gmail.com`,
	publicPhoneNumber: 380969696170,
	dateCreated: new Date().toString(),
};

// Loan
const newLoan = copyObject(loans.basic);
newLoan.name = `Cypress Test Loan ${randomString()}`;

// Borrower
const lastName_b = `last_name_${randomString()}`;
const newBorrowerAccount = {
	firstName: 'Testy',
	lastName: lastName_b,
	email: Cypress.env('googleEmail').replace('@', `+borrower_${lastName_b}@`),
	dateCreated: new Date().toString(),
	street1: '6402 24th Ave',
	street2: '-',
	city: 'Brooklyn',
	state: 'New York (NY)',
	zipcode: '11204',
};

// Partner
const lastName_p = `last_name_${randomString()}`;
const newPartnerAccount = {
	firstName: 'Testy',
	lastName: lastName_p,
	email: Cypress.env('googleEmail').replace('@', `+partner_${lastName_p}@`),
	dateCreated: new Date().toString(),
};

// Team Member
const lastName_tm = `last_name_${randomString()}`;
const newTeamMemberAccount = {
	firstName: 'Testy',
	lastName: lastName_tm,
	email: Cypress.env('googleEmail').replace('@', `+teammember_${lastName_tm}@`),
	street1: '6402 24th Ave',
	street2: '-',
	city: 'Brooklyn',
	state: 'New York (NY)',
	zipcode: '11204',
	businessName: `BusinessName_${randomString()}`,
	businessPublicName: `BusinessPublicName_${randomString()}`,
	publicContactEmail: `yourlandloans+pub_${randomString()}@gmail.com`,
	publicPhoneNumber: 380969696170,
	dateCreated: new Date().toString(),
};

export default {
	accounts,
	newLenderAccount,
	newLoan,
	newBorrowerAccount,
	newPartnerAccount,
	newTeamMemberAccount,
};
