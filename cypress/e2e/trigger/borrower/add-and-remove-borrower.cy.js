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

import {
	loginUser,
	createNewLoan,
	addBorrower,
	checkUserInLoan,
	removeUserFromLoan,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Add and Remove (Borrower)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	loginUser({ account: coreLenderAccount });

	createNewLoan({
		lenderAccount: coreLenderAccount,
		loan: newLoan,
	});

	// signup borrower
	addBorrower({
		borrowerAccount: coreBorrowerAccount,
		lenderEmail: coreLenderAccount.email,
		loanName: newLoan.name,
		withAddress: true,
	});

	checkUserInLoan({
		email: coreLenderAccount.email,
		userAccount: coreBorrowerAccount,
		loanName: newLoan.name,
		typeAccount: `Borrower`,
	});

	removeUserFromLoan({
		email: coreLenderAccount.email,
		userAccount: coreBorrowerAccount,
		loanName: newLoan.name,
		typeAccount: `Borrower`,
	});

	deleteAllLoans({ email: coreLenderAccount.email });
});
