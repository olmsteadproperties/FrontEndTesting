/// <reference types="cypress" />

import { coreLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	loginUser,
	createNewLoan,
	createRecordPayment,
	updateRecordPayment,
	updateDueDateInLoan,
	deleteRecordPayment,
	deleteLoan,
} from '/cypress/support/yll/actions';

const amountForChange = `4,000.00`;

describe('Record Payment (Lender)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	loginUser({ account: coreLenderAccount });

	createNewLoan({
		lenderAccount: coreLenderAccount,
		loan: newLoan,
	});

	createRecordPayment({ loan: newLoan, amount: `1234.56` });

	updateRecordPayment({ loan: newLoan, amountForChange });

	updateDueDateInLoan({
		email: coreLenderAccount.email,
		loanName: newLoan.name,
	});

	deleteRecordPayment({ loan: newLoan, amountForChange });

	deleteLoan({
		lenderEmail: coreLenderAccount.email,
		loanName: newLoan.name,
	});
});
