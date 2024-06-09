/// <reference types="cypress" />

import {
	coreLenderAccount,
	coreTeamMemberAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import { acceptEmailInvite, addTeamMember } from '/cypress/support/yll/actions';

describe('Prepare Team Member Account', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// Add Team Member
	addTeamMember({
		lenderEmail: coreLenderAccount.email,
		teamMemberAccount: coreTeamMemberAccount,
	});

	acceptEmailInvite({ email: coreTeamMemberAccount.email });
});
