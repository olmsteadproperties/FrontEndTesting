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
	loginUser,
	createNewLoan,
	checkVoting,
	addTeamMember,
	deleteTeamMember,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Feature Voting', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	loginUser({ account: coreLenderAccount });

	checkVoting();

	createNewLoan({
		lenderAccount: coreLenderAccount,
		loan: newLoan,
	});

	// add Team Member
	addTeamMember({
		lenderEmail: coreLenderAccount.email,
		teamMemberAccount: coreTeamMemberAccount,
	});

	checkVoting();

	// clean up: Team Member, Loans
	deleteTeamMember({
		lenderEmail: coreLenderAccount.email,
		teamMemberEmail: coreTeamMemberAccount.email,
	});

	deleteAllLoans({ email: coreLenderAccount.email });
});
