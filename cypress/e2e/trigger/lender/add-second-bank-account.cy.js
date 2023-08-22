/// <reference types="cypress" />

import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	setupPaymentAccount,
	dwollaSignup,
	removeBankAccount,
} from '/cypress/support/yll/actions';

describe('Add Second Bank Account (Lender)', () => {
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

	dwollaSignup({
		account: newLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	/// add bank accounts
	setupPaymentAccount({
		email: newLenderAccount.email,
		isIAV: true,
		bankName: 'TD Bank',
	});

	// add second bank account
	setupPaymentAccount({
		email: newLenderAccount.email,
		isIAV: true,
		bankName: 'Navy Federal Credit Union',
		isSaving: false,
		secondPaymentAccount: true,
	});

	removeBankAccount({ email: newLenderAccount.email, multiple: true });
});
