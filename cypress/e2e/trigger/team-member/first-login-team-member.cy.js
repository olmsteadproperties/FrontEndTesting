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
	changePlanLevel,
	createNewLoan,
	addTeamMember,
	firstLogin,
	deleteTeamMember,
	deleteLoan,
} from '/cypress/support/yll/actions';

describe('Edit profile (Team Member)', () => {
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

	const countClicks = 5; // the count of clicks on the "Send temporary password" button
	firstLogin({
		email: newTeamMemberAccount.email,
		countClicks: countClicks,
	});

	acceptEmailInvite({
		email: newTeamMemberAccount.email,
		shouldHasLength: countClicks + 1, // +1 - because the first message is sent by default
	});

	deleteTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberEmail: newTeamMemberAccount.email,
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
