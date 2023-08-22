/// <reference types="cypress" />

import {
	newLenderAccount,
	newLoan,
	newBorrowerAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
	randomString,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	addBorrower,
	addBankForBorrower,
	checkPaymentMethod,
	verifyPaymentAccount,
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

	const bankNameForBorrower = `BankName_TD_Bank_${randomString({
		withSymb: false,
	})}`;

	addBankForBorrower({
		emailLender: newLenderAccount.email,
		loanName: newLoan.name,
		firstName: newBorrowerAccount.firstName,
		lastName: newBorrowerAccount.lastName,
		bankNameForBorrower: bankNameForBorrower,
		borrowerEmail: newBorrowerAccount.email,
	});

	verifyPaymentAccount({ email: newBorrowerAccount.email });

	checkPaymentMethod({
		email: newBorrowerAccount.email,
		bankName: bankNameForBorrower,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
