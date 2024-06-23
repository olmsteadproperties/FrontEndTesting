/// <reference types="cypress" />

import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	acceptEmailInvite,
	addLender,
	createNewLoan,
	dwollaSignup,
	setupPaymentAccount,
	deleteLoan,
	deleteAndAddTagsInLoanDetails,
	checktagsInLoan,
} from '/cypress/support/yll/actions';

const tags = ['test_1', 'test_2'];

describe('Add tags to loan', () => {
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

	setupPaymentAccount({
		email: newLenderAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: { ...newLoan, tags },
	});

	checktagsInLoan({
		tags,
		loan: newLoan,
	});

	deleteAndAddTagsInLoanDetails(tags);

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
