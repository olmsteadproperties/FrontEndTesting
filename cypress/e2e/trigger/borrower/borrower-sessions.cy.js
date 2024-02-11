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
	borrowerSessions,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

const borrowerArray = ['a', 'b', 'c', 'd'];

describe('Add and Remove (Borrower)', () => {
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

	borrowerArray.map((el) => {
		// signup borrower
		addBorrower({
			borrowerAccount: {
				...newBorrowerAccount,
				email: `${newBorrowerAccount.email.replace('+', `+${el}_`)}`,
			},
			lenderEmail: newLenderAccount.email,
			loanName: newLoan.name,
			withAddress: true,
		});

		acceptEmailInvite({
			email: `${newBorrowerAccount.email.replace('+', `+${el}_`)}`,
		});
	});

	borrowerArray.map((el) => {
		borrowerSessions({
			email: newLenderAccount.email,
			borrowerEmail: `${newBorrowerAccount.email.replace('+', `+${el}_`)}`,
		});
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
