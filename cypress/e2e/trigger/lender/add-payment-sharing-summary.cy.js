/// <reference types="cypress" />

import {
	newLenderAccount,
	newLoan,
	newBorrowerAccount,
	newPartnerAccount,
	newTeamMemberAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	createNewLoan,
	addBorrower,
	addPartner,
	addTeamMember,
	paymentSharingSummary,
	removeUserFromLoan,
	deleteTeamMember,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Add Payment Sharing Summary', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// signup lender
	addLender({
		newLenderAccount: newLenderAccount,
	});

	acceptEmailInvite({ email: newLenderAccount.email });

	// set up payment method for lender
	dwollaSignup({
		account: newLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	setupPaymentAccount({
		email: newLenderAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	// change the plan
	changePlanLevel({
		lenderAccount: newLenderAccount,
		isFree: false,
		isOnlyHighestPlan: true,
	});

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	// add Borrower
	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withAddress: true,
	});

	acceptEmailInvite({ email: newBorrowerAccount.email });

	// add Partner
	addPartner({
		lenderEmail: newLenderAccount.email,
		partnerAccount: newPartnerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newPartnerAccount.email });

	// add Team Member
	addTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberAccount: newTeamMemberAccount,
	});

	acceptEmailInvite({ email: newTeamMemberAccount.email });

	paymentSharingSummary({
		lenderEmail: newLenderAccount.email,
		arrEmails: [
			// newBorrowerAccount.email,
			newPartnerAccount.email,
			newTeamMemberAccount.email,
		],
	});

	// TODO: add check for payment sharing summary

	// clean up: Borrower, Partner, Team Member, Loans
	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newBorrowerAccount,
		loanName: newLoan.name,
		typeAccount: `Borrower`,
	});

	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: newLoan.name,
		typeAccount: `Partner`,
	});

	deleteTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberEmail: newTeamMemberAccount.email,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
