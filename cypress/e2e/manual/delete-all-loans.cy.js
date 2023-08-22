/// <reference types='cypress' />

import { accounts } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import { deleteAllLoans } from '/cypress/support/yll/actions';

describe('Lender Flow - Delete All Loans', () => {
	before(() => {
		// Logs out any lingering login attempts.
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	deleteAllLoans({ email: accounts.lender.email }); // we don't need it now
});
