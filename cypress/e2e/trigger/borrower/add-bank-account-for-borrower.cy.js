/// <reference types="cypress" />

import {
	newLenderAccount,
	newLoan,
	newBorrowerAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
	generateBankName,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	checkPaymentMethod,
	changePlanLevel,
	addBorrower,
	addBankForBorrower,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Add Bank Account (Borrower)', () => {
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

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
	});

	// signup borrower
	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newBorrowerAccount.email });

	dwollaSignup({
		account: newBorrowerAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
		isBorrower: true,
	});

	const testBankName = generateBankName({ bankName: 'Micro_deposits' });
	addBankForBorrower({
		emailLender: newLenderAccount.email,
		borrower: newBorrowerAccount,
		loanName: newLoan.name,
		testBankName,
	});

	checkPaymentMethod({
		email: newBorrowerAccount.email,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
