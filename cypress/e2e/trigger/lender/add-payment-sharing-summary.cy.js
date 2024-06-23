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
	addPartner,
	addTeamMember,
	addPaymentSharingSummary,
	checkPaymentSharingSummary,
	updatePaymentSharingSummary,
	removePaymentSharingSummary,
	removeUserFromLoan,
	deleteTeamMember,
	deleteLoan,
} from '/cypress/support/yll/actions';

describe('Add Payment Sharing Summary', () => {
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

	// add Partner
	addPartner({
		lenderEmail: newLenderAccount.email,
		partnerAccount: newPartnerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newPartnerAccount.email });

	// add Team Member
	addTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberAccount: newTeamMemberAccount,
	});

	acceptEmailInvite({ email: newTeamMemberAccount.email });

	// Payment Sharing Summary
	const amountPercentage = 10;
	const firstPositionAmount = 40;
	addPaymentSharingSummary({
		lenderEmail: newLenderAccount.email,
		amountPercentage: amountPercentage,
		firstPositionAmount: firstPositionAmount,
		arrEmails: [newPartnerAccount.email, newTeamMemberAccount.email],
	});

	checkPaymentSharingSummary({
		lenderEmail: newLenderAccount.email,
		amountPercentage: amountPercentage,
		firstPositionAmount: firstPositionAmount,
		arrEmails: [newPartnerAccount.email, newTeamMemberAccount.email],
	});

	const newAmountPercentage = 21;
	const newFirstPositionAmount = 51;
	updatePaymentSharingSummary({
		lenderEmail: newLenderAccount.email,
		amountPercentage: newAmountPercentage,
		firstPositionAmount: newFirstPositionAmount,
		arrEmails: [newPartnerAccount.email, newTeamMemberAccount.email],
	});

	checkPaymentSharingSummary({
		amountPercentage: newAmountPercentage,
		firstPositionAmount: newFirstPositionAmount,
		arrEmails: [newPartnerAccount.email, newTeamMemberAccount.email],
	});

	removePaymentSharingSummary({
		lenderEmail: newLenderAccount.email,
		arrEmails: [newPartnerAccount.email, newTeamMemberAccount.email],
	});

	// clean up: Partner, Team Member, Loans

	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: newLoan.name,
		typeAccount: `Partner`,
	});

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
