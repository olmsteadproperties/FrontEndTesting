/// <reference types="cypress" />

import {
	coreLenderAccount,
	coreBorrowerAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import { acceptEmailInvite, addBorrower } from '/cypress/support/yll/actions';

describe('Prepare Borrower Account', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// Sign up Borrower
	addBorrower({
		lenderEmail: coreLenderAccount.email,
		borrowerAccount: coreBorrowerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: coreBorrowerAccount.email });
});
