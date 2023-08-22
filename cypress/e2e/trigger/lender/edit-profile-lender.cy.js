/// <reference types="cypress" />

import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	editeProfile,
	checkProfileAfterEdite,
} from '/cypress/support/yll/actions';

let lenderAccount = { ...newLenderAccount };

describe('Edit profile (Lender)', () => {
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

	editeProfile({ userAccount: lenderAccount, withPublic: true });

	checkProfileAfterEdite({ userAccount: lenderAccount, withPublic: true });
});
