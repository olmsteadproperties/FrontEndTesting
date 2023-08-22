/// <reference types="cypress" />

import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	removeBankAccount,
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

	const arrNameOfBanks = [
		`Regions Bank`,
		`TD Bank`,
		`Navy Federal Credit Union`,
		`Fidelity`,
		`Citizens Bank`,
		`Huntington Bank`,
		`Wealthfront`,
		`Betterment`,
		`Stash`,
	];

	arrNameOfBanks.map((bankName) => {
		setupPaymentAccount({
			email: newLenderAccount.email,
			isIAV: true,
			bankName: `${bankName}`,
			isSaving: false,
		});

		removeBankAccount({ email: newLenderAccount.email });
	});
});
