/// <reference types="cypress" />

import {
	newLenderAccount,
	newPartnerAccount,
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
	changePlanLevel,
	addPartner,
	checkUserInLoan,
	removeUserFromLoan,
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

	addPartner({
		lenderEmail: newLenderAccount.email,
		partnerAccount: newPartnerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newPartnerAccount.email });

	checkUserInLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: newLoan.name,
		typeAccount: `Partner`,
	});

	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: newLoan.name,
		typeAccount: `Partner`,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
