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
	createNewLoan,
	requiredPaymentOverride,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Required Payment Override (Lender)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	addLender({
		newLenderAccount: newLenderAccount,
	});

	acceptEmailInvite({ email: newLenderAccount.email });

	dwollaSignup({
		account: newLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
		isBallonPaymnent: true,
		textForPopUp: 'OK',
	});

	requiredPaymentOverride();

	deleteAllLoans({ email: newLenderAccount.email });
});
