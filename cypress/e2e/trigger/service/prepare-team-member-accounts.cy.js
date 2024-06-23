/// <reference types="cypress" />

import {
	coreLenderAccount,
	coreTeamMemberAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	acceptEmailInvite,
	addTeamMember,
	createNewLoan,
} from '/cypress/support/yll/actions';

describe('Prepare Team Member Account', () => {
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

	// Add Team Member
	addTeamMember({
		lenderEmail: coreLenderAccount.email,
		teamMemberAccount: coreTeamMemberAccount,
	});

	acceptEmailInvite({ email: coreTeamMemberAccount.email });

	deleteLoan({
		lenderEmail: coreLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
