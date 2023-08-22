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

describe('Signup Dwolla Change of Statuses (Dwolla)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	const arrStatuses = [
		{ lenderEl: { ...newLenderAccount }, statusEl: 'verified' },
		{ lenderEl: { ...newLenderAccount }, statusEl: 'suspended' },
		{ lenderEl: { ...newLenderAccount }, statusEl: 'document' },
		{ lenderEl: { ...newLenderAccount }, statusEl: 'retry' },
	];

	// changing emails for the next tests
	// (we must in advance to know emails for correct continuing testing)
	for (let i = 0; i < arrStatuses.length; i++) {
		arrStatuses[i].lenderEl.email = arrStatuses[i].lenderEl.email.replace(
			'@',
			`_${i}@`
		);
	}

	// signup and save accounts of lenders
	for (let i = 0; i < arrStatuses.length; i++) {
		addLender({
			newLenderAccount: arrStatuses[i].lenderEl,
		});
	}

	// need separate this ↑ and this ↓ logic for correctly get data from JSON

	// set up payment method for lenders
	for (let i = 0; i < arrStatuses.length; i++) {
		acceptEmailInvite({ email: arrStatuses[i].lenderEl.email });

		dwollaSignup({
			account: arrStatuses[i].lenderEl,
			businessType: 'LLC',
			dowllaStatus: arrStatuses[i].statusEl,
		});

		if (arrStatuses[i].statusEl === 'retry') {
			dwollaSignup({
				account: arrStatuses[i].lenderEl,
				businessType: 'LLC',
				dowllaStatus: 'verified',
				isRetry: true,
			});
		}
	}
});
