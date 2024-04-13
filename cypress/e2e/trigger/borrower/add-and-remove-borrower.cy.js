/// <reference types="cypress" />

import {
	coreLenderAccount,
	coreBorrowerAccount,
	newLenderAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	loginUser,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
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

	// // // signup lender
	// addLender({
	// 	newLenderAccount: newLenderAccount,
	// });

	// acceptEmailInvite({ email: newLenderAccount.email });

	// // set up payment method for lender
	// dwollaSignup({
	// 	account: newLenderAccount,
	// 	businessType: 'LLC',
	// 	dowllaStatus: 'verified',
	// });

	// setupPaymentAccount({
	// 	email: newLenderAccount.email,
	// 	isIAV: true,
	// 	bankName: `TD Bank`,
	// });

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

	// acceptEmailInvite({ email: coreBorrowerAccount.email });

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
