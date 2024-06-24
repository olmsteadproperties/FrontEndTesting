/// <reference types="cypress" />

import {
	newLenderAccount,
	coreTeamMemberAccount,
	newLoan,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	loginUser,
	createRecordPayment,
	updateRecordPayment,
	updateDueDateInLoan,
	deleteRecordPayment,
	deleteLoan,
} from '/cypress/support/yll/actions';

const amountForChange = `4,000.00`;

describe('Record Payment (Team Member)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	loginUser({ account: coreTeamMemberAccount });

	createNewLoan({
		lenderAccount: coreTeamMemberAccount,
		loan: newLoan,
	});

	// Record Payment
	createRecordPayment({ loan: newLoan, amount: `1234.56` });

	updateRecordPayment({ loan: newLoan, amountForChange });

	updateDueDateInLoan({
		email: newLenderAccount.email,
		loanName: newLoan.name,
	});

	deleteRecordPayment({ loan: newLoan, amountForChange });

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});
});
