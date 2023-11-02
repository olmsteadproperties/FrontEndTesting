/// <reference types="cypress" />

import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	acceptEmailInvite,
	addBorrower,
	addBorrowerAssist,
	addLender,
	createNewLoan,
	dwollaSignup,
	setupPaymentAccount,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Add tags to loan', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	addLender({
		newLenderAccount: newLenderAccount,
	});

	acceptEmailInvite({ email: newLenderAccount.email });

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

	deleteAllLoans({
		email: newLenderAccount.email,
	});
});
