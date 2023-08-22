/// <reference types="cypress" />

import {
	newLenderAccount,
	newBorrowerAccount,
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
	addBorrower,
	firstLogin,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('First Login (Borrower)', () => {
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

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	// signup borrower
	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withAddress: true,
	});

	const countClicks = 4; // the count of clicks on the "Send temporary password" button
	firstLogin({
		email: newBorrowerAccount.email,
		countClicks: countClicks,
	});

	acceptEmailInvite({
		email: newBorrowerAccount.email,
		shouldHasLength: countClicks + 1, // +1 - because the first message is sent by default
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
