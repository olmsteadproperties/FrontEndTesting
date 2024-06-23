/// <reference types="cypress" />

import {
	coreLenderAccount,
	corePartnerAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import { acceptEmailInvite, addPartner } from '/cypress/support/yll/actions';

describe('Prepare Partner Accounts', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	createNewLoan({
		lenderAccount: coreLenderAccount,
		loan: newLoan,
	});

	// Add Partner
	addPartner({
		lenderEmail: coreLenderAccount.email,
		partnerAccount: corePartnerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: corePartnerAccount.email });
});
