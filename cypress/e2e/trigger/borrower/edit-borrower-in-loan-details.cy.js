/// <reference types="cypress" />

import {
	newLenderAccount,
	newBorrowerAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	createNewLoan,
	addBorrower,
	checkUserInLoan,
	editeProfile,
	deleteLoan,
} from '/cypress/support/yll/actions';

describe('Edit Borrower in Loan Details (Borrower)', () => {
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

	// set up payment method for lender
	dwollaSignup({
		account: newLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	setupPaymentAccount({
		email: newLenderAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	// signup borrower
	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withAddress: true,
	});

	acceptEmailInvite({ email: newBorrowerAccount.email });

	editeProfile({
		email: newLenderAccount.email,
		userAccount: newBorrowerAccount,
		typeChecking: `in the loan`,
		loanName: newLoan.name,
	});

	checkUserInLoan({
		email: newLenderAccount.email,
		userAccount: newBorrowerAccount,
		loanName: newLoan.name,
		typeAccount: `Borrower`,
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
