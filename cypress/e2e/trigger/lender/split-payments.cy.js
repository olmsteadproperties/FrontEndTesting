/// <reference types="cypress" />

import {
	newLenderAccount,
	newLoan,
	newPartnerAccount,
	newTeamMemberAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	createNewLoan,
	splitPayments,
	makeManualPayment,
	addPartner,
	addTeamMember,
	addPaymentSharingSummary,
	checkPaymentSharingSummary,
	updatePaymentSharingSummary,
	removePaymentSharingSummary,
	removeUserFromLoan,
	deleteTeamMember,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

describe('Split(Undo Split) payment', () => {
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

	makeManualPayment({
		lenderAccount: newLenderAccount,
		loanName: newLoan.name,
		amount: '1234.56',
		notes: 'Cypress test split payments',
		dateReceived: newLoan.loanOriginationDate,
		paymentDueDate: 0,
		lateFees: 0, // late fees added at 20.01.2024
	});

	splitPayments({ loan: newLoan });
	// deleteAllLoans({ email: newLenderAccount.email });
});
