///<reference types="cypress-iframe" />

import {
	newLenderAccount,
	newLoan,
	newBorrowerAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
	differenceDays,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addBorrower,
	acceptEmailInvite,
	setupPaymentAccount,
	makePayment,
	deleteLoan,
	deletePaymentMethod,
	addLender,
	dwollaSignup,
} from '/cypress/support/yll/actions';

describe('Signup Pay Flow IAV (Borrower)', () => {
	before(() => {
		// Logs out any lingering login attempts.
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

	//set up payment method for lender
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
	});

	acceptEmailInvite({ email: newBorrowerAccount.email });

	// set up payment method for borrower
	dwollaSignup({
		account: newBorrowerAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
		isBorrower: true,
	});

	setupPaymentAccount({
		email: newBorrowerAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});
	const isHigherThanTen = differenceDays(
		newLoan.loanOriginationDate,
		newLoan.gracePeriod
	); // add fees if outdated payment

	makePayment({
		amount: isHigherThanTen ? '1020' : '1000',
		loanName: newLoan.name,
		dataOfStartLoan: newLoan.loanOriginationDate,
	});

	// check payment account (delete if exist)
	deletePaymentMethod({ email: newLenderAccount.email });

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});
});
