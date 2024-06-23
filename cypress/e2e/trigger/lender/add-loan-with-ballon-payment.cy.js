/// <reference types="cypress" />

import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';
import { firstDayOfNextMonth } from '/cypress/support/yll/loans';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	createNewLoan,
	editLoan,
	checkFieldOnLoanPage,
	deleteLoan,
	deleteLoanField,
} from '/cypress/support/yll/actions';

const formattedData = new Date(
	firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1)
).toLocaleDateString('en-US', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
}); // 01/08/2023)

const arrBallonPayment = [
	{
		changeSection: 'Payments',
		dataForUpdate: { ballonPayment: formattedData },
		elementForCheck: [
			{
				value: formattedData,
				title: 'Payment Date',
			},
		],
	},
]; // if need check other fields, add them here as objects

describe('Add Loan with Ballon Payment (Lender)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	addLender({
		newLenderAccount: newLenderAccount,
	});

	acceptEmailInvite({ email: newLenderAccount.email });

	dwollaSignup({
		account: newLenderAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
	});

	createNewLoan({
		lenderAccount: newLenderAccount,
		loan: newLoan,
		isBallonPaymnent: true,
		textForPopUp: 'OK',
	});

	arrBallonPayment.map((item) => {
		editLoan({
			changeSection: item.changeSection,
			dataForUpdate: item.dataForUpdate,
		});
	});

	arrBallonPayment.map((item) => {
		checkFieldOnLoanPage({
			elementsForCheck: item.elementForCheck,
		});
	});

	// TO DO: delete ballon payment
	deleteLoanField({
		field: 'Payments',
		selector: 'label',
		content: 'Balloon Payment Date',
		key: 'ballonPayment',
		buttonText: 'Remove Balloon Payment',
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
