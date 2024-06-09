/// <reference types="cypress" />

import {
	coreLenderAccount,
	coreBorrowerAccount,
	corePartnerAccount,
	coreTeamMemberAccount,
	newLoan,
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
} from '/cypress/support/yll/actions';

describe('Prepare Accounts', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// Signup Lender
	addLender({
		newLenderAccount: coreLenderAccount,
	});

	acceptEmailInvite({ email: coreLenderAccount.email });

	// set up payment method for lender
	dwollaSignup({
		account: coreLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	setupPaymentAccount({
		email: coreLenderAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	// change the plan
	changePlanLevel({
		lenderAccount: coreLenderAccount,
		isFree: false,
		isOnlyHighestPlan: true,
	});

	createNewLoan({
		lenderAccount: coreLenderAccount,
		loan: newLoan,
	});

	// Sign up Borrower
	addBorrower({
		lenderEmail: coreLenderAccount.email,
		borrowerAccount: coreBorrowerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: coreBorrowerAccount.email });

	// dwollaSignup({
	// 	account: coreBorrowerAccount,
	// 	businessType: 'LLC',
	// 	dowllaStatus: 'verified',
	// 	isBorrower: true,
	// });

	setupPaymentAccount({
		email: coreBorrowerAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	// Add Partner
	addPartner({
		lenderEmail: coreLenderAccount.email,
		partnerAccount: corePartnerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: corePartnerAccount.email });

	// Add Team Member
	addTeamMember({
		lenderEmail: coreLenderAccount.email,
		teamMemberAccount: coreTeamMemberAccount,
	});

	acceptEmailInvite({ email: coreTeamMemberAccount.email });
});