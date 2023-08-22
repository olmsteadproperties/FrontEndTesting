/// <reference types="cypress" />

import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	manageFees,
	removeFee,
	lateFee,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

const feeName = `Test_10`;
const feeSum = 10;

describe('Manage Fees (Lender)', () => {
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

	manageFees({ loan: newLoan, feeName, feeSum });

	removeFee({ feeName, typeFee: 'oneTime', loan: newLoan });

	lateFee({ feeSum, loan: newLoan });

	removeFee({ feeName, typeFee: 'late', feeSum, loan: newLoan });

	deleteAllLoans({ email: newLenderAccount.email });
});
