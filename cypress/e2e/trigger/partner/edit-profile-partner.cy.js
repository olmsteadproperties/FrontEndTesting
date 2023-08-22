/// <reference types="cypress" />

import {
	newLenderAccount,
	newLoan,
	newPartnerAccount,
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
	changePlanLevel,
	createNewLoan,
	addPartner,
	editeProfile,
	checkProfileAfterEdite,
	removeUserFromLoan,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Edit profile (Team Member)', () => {
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

	editeProfile({ userAccount: newPartnerAccount, onlyFullName: true });

	checkProfileAfterEdite({
		userAccount: newPartnerAccount,
		onlyFullName: true,
	});

	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: newLoan.name,
		typeAccount: `Partner`,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
