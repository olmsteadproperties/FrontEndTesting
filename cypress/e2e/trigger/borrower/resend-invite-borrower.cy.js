/// <reference types="cypress" />

import {
	newLenderAccount,
	newBorrowerAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	createNewLoan,
	addBorrower,
	changePlanLevel,
	resendInvite,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Add and Remove (Partner)', () => {
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

	// signup partner
	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});

	const countResendeClicks = 3; // the count of clicks on the "resend" button
	resendInvite({
		email: newLenderAccount.email,
		loanName: newLoan.name,
		countResendeClicks,
		whoom: 'Borrower',
	});

	acceptEmailInvite({
		email: newBorrowerAccount.email,
		shouldHasLength: countResendeClicks + 1, // +1 - because the first message is sent by default
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
