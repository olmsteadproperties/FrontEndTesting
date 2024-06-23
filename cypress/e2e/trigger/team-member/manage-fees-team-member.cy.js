/// <reference types="cypress" />

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
	manageFees,
	addTeamMember,
	removeFee,
	lateFee,
	deleteTeamMember,
	deleteLoan,
} from '/cypress/support/yll/actions';

const feeName = `Test_10`;
const feeSum = 10;

describe('Manage Fees (Team Member)', () => {
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

	//set up payment method for lender
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

	// fees
	manageFees({ loan: newLoan, feeName, feeSum });

	removeFee({ feeName, typeFee: 'oneTime', loan: newLoan });

	lateFee({ feeSum, loan: newLoan });

	removeFee({ feeName, typeFee: 'late', feeSum, loan: newLoan });

	deleteTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberEmail: newTeamMemberAccount.email,
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
