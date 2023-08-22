import {
	newLenderAccount,
	newLoan,
	newTeamMemberAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	addTeamMember,
	duplicateExistingLoan,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Duplicate Existing Loan (Team Member)', () => {
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

	// create loan
	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	// Team Member
	addTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberAccount: newTeamMemberAccount,
	});

	acceptEmailInvite({ email: newTeamMemberAccount.email });

	duplicateExistingLoan({
		email: newLenderAccount.email,
		loanName: newLoan.name,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
