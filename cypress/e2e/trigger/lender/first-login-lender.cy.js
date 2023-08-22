/// <reference types="cypress" />

import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	firstLogin,
} from '/cypress/support/yll/actions';

describe('First Login (lender)', () => {
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

	const countClicks = 6; // the count of clicks on the "Send temporary password" button
	firstLogin({
		email: newLenderAccount.email,
		countClicks: countClicks,
	});

	acceptEmailInvite({
		email: newLenderAccount.email,
		shouldHasLength: countClicks + 1, // +1 - because the first message is sent by default
	});
});
