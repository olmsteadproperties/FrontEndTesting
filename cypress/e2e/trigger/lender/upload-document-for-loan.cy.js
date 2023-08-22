import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	createNewLoan,
	uploadDocumentForLoan,
	deleteLoan,
} from '/cypress/support/yll/actions';

describe('Record Payment (Lender)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	// signup
	addLender({
		newLenderAccount: newLenderAccount,
	});

	acceptEmailInvite({ email: newLenderAccount.email });

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	uploadDocumentForLoan({
		email: newLenderAccount.email,
		loanName: newLoan.name,
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});
});
