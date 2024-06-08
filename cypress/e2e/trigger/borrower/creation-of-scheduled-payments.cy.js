/// <reference types="cypress" />

import {
	coreLenderAccount,
	newLoan,
	coreBorrowerAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	loginUser,
	createNewLoan,
	addBorrower,
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

	// // signup
	// addLender({
	// 	coreLenderAccount: coreLenderAccount,
	// });

	// acceptEmailInvite({ email: coreLenderAccount.email });

	// // set up payment method for lender
	// dwollaSignup({
	// 	account: coreLenderAccount,
	// 	businessType: 'LLC',
	// 	dowllaStatus: 'verified',
	// });

	// setupPaymentAccount({
	// 	email: coreLenderAccount.email,
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
	});

	// acceptEmailInvite({ email: coreBorrowerAccount.email });

	// dwollaSignup({
	// 	account: coreBorrowerAccount,
	// 	businessType: 'LLC',
	// 	dowllaStatus: 'verified',
	// 	isBorrower: true,
	// });

	// setupPaymentAccount({
	// 	email: coreBorrowerAccount.email,
	// 	isIAV: true,
	// 	bankName: `TD Bank`,
	// });

	// const isHigherThanTen = differenceDays(
	// 	newLoan.loanOriginationDate,
	// 	newLoan.gracePeriod
	// ); // add fees if outdated payment

	makePayment({
		email: coreBorrowerAccount.email,
		amount: 1000,
		loanName: newLoan.name,
		dataOfStartLoan: newLoan.loanOriginationDate,
		lateFees: 0, // added late fees 20.01.2024
	});

	// One Time
	schedulePayment({
		isOneTimePayment: true,
		amount: oneTimeAmount,
		borrowerAccount: coreBorrowerAccount,
		loanName: newLoan.name,
	});
	compareSchedulePayment({
		selectPaymentType: `One Time`,
		amount: oneTimeAmount,
	});

	// Recurring
	schedulePayment({
		isRecurringPayment: true,
		amount: recurringAmount,
		borrowerAccount: coreBorrowerAccount,
		loanName: newLoan.name,
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
		lenderEmail: coreLenderAccount.email,
		loanName: newLoan.name,
	});
});
