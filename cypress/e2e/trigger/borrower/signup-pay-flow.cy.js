/// <reference types="cypress" />

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
	verifyMicroDeposits,
	makePayment,
	addLender,
	dwollaSignup,
	cancelACHPayment,
	deleteLoan,
} from '/cypress/support/yll/actions';

describe('Signup Pay Flow (Borrower)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// signup
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
		isIAV: false,
		bankName: `TD Bank`,
	});

	verifyMicroDeposits();

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

	dwollaSignup({
		account: newBorrowerAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
		isBorrower: true,
	});

	setupPaymentAccount({
		email: newBorrowerAccount.email,
		isIAV: false,
	});

	verifyMicroDeposits();

	const isHeighterThanTen = differenceDays(
		newLoan.loanOriginationDate,
		newLoan.gracePeriod
	);
	const borrowerAmount = isHeighterThanTen ? '1000' : '1020';
	makePayment({
		amount: borrowerAmount,
		loanName: newLoan.name,
		dataOfStartLoan: newLoan.loanOriginationDate,
	});

	cancelACHPayment({
		account: newBorrowerAccount,
		isLender: false,
		loanName: newLoan.name,
		amount: +borrowerAmount,
		transactionFees: 1,
	});

	const lenderAmount = isHeighterThanTen ? `520` : '500';
	makePayment({
		amount: lenderAmount,
		loanName: newLoan.name,
		dataOfStartLoan: newLoan.loanOriginationDate,
	});

	cancelACHPayment({
		account: newLenderAccount,
		isLender: true,
		loanName: newLoan.name,
		amount: +lenderAmount,
		transactionFees: 1,
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});
});
