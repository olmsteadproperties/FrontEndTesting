import { randomString } from '/cypress/support/yll/util';
import loans from '/cypress/support/yll/loans';
import {
	temporaryBorrower,
	temporaryLender,
	temporaryPartner,
	temporaryTeamMember,
} from './new-accounts';

// Loan
const newLoan = structuredClone(loans.basic);
newLoan.name = `Cypress Test Loan ${randomString()}`;

// Account data
const newAccountData = {
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

// Lender
const coreLenderAccount = {
	...newAccountData,
	email: temporaryLender.email,
	password: temporaryLender.password,
};

const newLenderAccount = {
	...newAccountData,
	email: Cypress.env('googleEmail').replace('@', `+lender_${randomString()}@`),
};

// Borrower
const coreBorrowerAccount = {
	...newAccountData,
	email: temporaryBorrower.email,
	password: temporaryBorrower.password,
};

const newBorrowerAccount = {
	...newAccountData,
	email: Cypress.env('googleEmail').replace(
		'@',
		`+borrower_${randomString()}}@`
	),
};

// Partner
const corePartnerAccount = {
	...newAccountData,
	email: temporaryPartner.email,
	password: temporaryPartner.password,
};

const newPartnerAccount = {
	...newAccountData,
	email: Cypress.env('googleEmail').replace('@', `+partner_${randomString()}@`),
};

// Team Member
const coreTeamMemberAccount = {
	...newAccountData,
	email: temporaryTeamMember.email,
	password: temporaryTeamMember.password,
};

const newTeamMemberAccount = {
	...newAccountData,
	email: Cypress.env('googleEmail').replace(
		'@',
		`+teammember_${randomString()}@`
	),
};

export default {
	newLoan,
	coreLenderAccount,
	newLenderAccount,
	coreBorrowerAccount,
	newBorrowerAccount,
	corePartnerAccount,
	newPartnerAccount,
	coreTeamMemberAccount,
	newTeamMemberAccount,
};
