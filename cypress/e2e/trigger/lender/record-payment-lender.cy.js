/// <reference types="cypress" />

import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	createNewLoan,
	createRecordPayment,
	updateRecordPayment,
	updateDueDateInLoan,
	deleteRecordPayment,
	deleteLoan,
} from '/cypress/support/yll/actions';

const amountForChange = `4,000.00`;

describe('Record Payment (Lender)', () => {
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

	// change the plan
	changePlanLevel({
		lenderAccount: newLenderAccount,
		isFree: false,
		isOnlyHighestPlan: true,
	});

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	createRecordPayment({ loan: newLoan, amount: `1234.56` });

	updateRecordPayment({ loan: newLoan, amountForChange });

	updateDueDateInLoan({
		email: newLenderAccount.email,
		loanName: newLoan.name,
	});

	deleteRecordPayment({ loan: newLoan, amountForChange });

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});
});
