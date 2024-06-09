/// <reference types="cypress" />

import { coreLenderAccount, newLoan } from '/cypress/support/yll/accounts';

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
} from '/cypress/support/yll/actions';

describe('Prepare Lender Account + Loan', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// Signup Lender
	addLender({
		newLenderAccount: coreLenderAccount,
	});

	acceptEmailInvite({ email: coreLenderAccount.email });

	// set up payment method for lender
	dwollaSignup({
		account: coreLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	setupPaymentAccount({
		email: coreLenderAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	// change the plan
	changePlanLevel({
		lenderAccount: coreLenderAccount,
		isFree: false,
		isOnlyHighestPlan: true,
	});

	createNewLoan({
		lenderAccount: coreLenderAccount,
		loan: newLoan,
	});
});
