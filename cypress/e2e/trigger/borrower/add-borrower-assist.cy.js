/// <reference types="cypress" />

import {
	newBorrowerAccount,
	newLenderAccount,
	coreLenderAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	acceptEmailInvite,
	addBorrower,
	loginUser,
	addBorrowerAssist,
	createNewLoan,
	setupPaymentAccount,
	deleteLoan,
} from '/cypress/support/yll/actions';

describe('Add borrower assist', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	loginUser({ account: coreLenderAccount });

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newBorrowerAccount.email });

	setupPaymentAccount({
		email: newBorrowerAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	addBorrowerAssist({
		email: coreLenderAccount.email,
		borrower: newBorrowerAccount,
		loanName: newLoan.name,
	});

	deleteLoan({
		lenderEmail: coreLenderAccount.email,
		loanName: newLoan.name,
	});
});
