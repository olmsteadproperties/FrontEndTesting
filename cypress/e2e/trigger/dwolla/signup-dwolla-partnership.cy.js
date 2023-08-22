/// <reference types="cypress" />

import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	acceptEmailInvite,
	addLender,
	dwollaSignup,
} from '/cypress/support/yll/actions';

describe('Signup Dwolla Partnership (Dwolla)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// signup
	addLender({
		newLenderAccount: newLenderAccount,
	});

	acceptEmailInvite({ email: newLenderAccount.email });

	// set up payment method for lender
	dwollaSignup({
		account: newLenderAccount,
		businessType: 'Partnership',
		dowllaStatus: 'verified',
	});
});
