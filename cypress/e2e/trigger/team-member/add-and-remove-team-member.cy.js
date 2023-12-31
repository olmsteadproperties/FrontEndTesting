/// <reference types="cypress" />

import {
	newLenderAccount,
	newTeamMemberAccount,
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
	createNewLoan,
	changePlanLevel,
	addTeamMember,
	deleteTeamMember,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Add and Remove (Team Member)', () => {
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

	// signup partner
	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	addTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberAccount: newTeamMemberAccount,
	});

	acceptEmailInvite({ email: newTeamMemberAccount.email });

	deleteTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberEmail: newTeamMemberAccount.email,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
