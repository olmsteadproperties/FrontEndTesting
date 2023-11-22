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
	addLender,
	dwollaSignup,
	makePayment,
	schedulePayment,
	compareSchedulePayment,
	editeSchedulePayment,
	deleteLoan,
} from '/cypress/support/yll/actions';

newLoan.financedAmount = 30000;
const recurringAmount = 800;
const recurringAmountForEdite = 500;
const oneTimeAmount = 200;

describe('Creation of Scheduled Payments (Borrower)', () => {
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

	// const isHigherThanTen = differenceDays(
	// 	newLoan.loanOriginationDate,
	// 	newLoan.gracePeriod
	// ); // add fees if outdated payment

	makePayment({
		email: newBorrowerAccount.email,
		amount: 1000,
		loanName: newLoan.name,
		dataOfStartLoan: newLoan.loanOriginationDate,
		lateFees: 20,
	});

	// One Time
	schedulePayment({
		isOneTimePayment: true,
		amount: oneTimeAmount,
		borrowerAccount: newBorrowerAccount,
	});
	compareSchedulePayment({
		selectPaymentType: `One Time`,
		amount: oneTimeAmount,
	});

	// Recurring
	schedulePayment({
		isRecurringPayment: true,
		amount: recurringAmount,
		borrowerAccount: newBorrowerAccount,
	});
	compareSchedulePayment({
		selectPaymentType: `Recurring`,
		amount: recurringAmount,
	});

	editeSchedulePayment({
		selectPaymentType: `Recurring`,
		newAmount: recurringAmountForEdite,
	});

	compareSchedulePayment({
		selectPaymentType: `Recurring`,
		amount: recurringAmountForEdite,
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});
});
