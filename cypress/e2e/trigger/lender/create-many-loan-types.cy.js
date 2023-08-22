/// <reference types='cypress' />

import {
	newLenderAccount,
	newLoan as baseLoan,
} from '/cypress/support/yll/accounts';

import {
	randomString,
	clearAllLocalData,
	stopOnFirstFailure,
	copyObject,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

let loansToCreate = [];

// Loan with additional one time fees.
let loanWithFees = copyObject(baseLoan);
loanWithFees.name = `Cypress Test Loan With Extra Fees ${randomString()}`;
loanWithFees.additionalFees = [
	{
		name: 'Not Convenient Fee',
		charge: '5',
	},
	{
		name: 'Dont have a good face fee',
		charge: '200',
	},
];
loansToCreate.push(loanWithFees);

// Loan with fee that is a percentage instead of a flat fee.
let loanWithPercentFees = copyObject(baseLoan);
loanWithPercentFees.name = `Cypress Test Loan With Percentage Fees ${randomString()}`;
loanWithPercentFees.lateFeeType = 'Percentage';
delete loanWithPercentFees.lateFeeAmountA;
loanWithPercentFees.lateFeeAmountP = '.1';
loansToCreate.push(loanWithPercentFees);

// Loan using the alternate inetest method of 365
let loanWithAltInterestMethod = copyObject(baseLoan);
loanWithAltInterestMethod.name = `Cypress Test Loan With Alt Interest Method ${randomString()}`;
loanWithAltInterestMethod.daysInterestMethod = '365';
loansToCreate.push(loanWithAltInterestMethod);

// Backdated loan.
let loanWithOldDates = copyObject(baseLoan);
loanWithOldDates.name = `Cypress Test Loan With Backdated Start ${randomString()}`;
loanWithOldDates.interestStartDate = '08/28/2021';
loanWithOldDates.paymentStartDate = '08/28/2021'; // was 06/27/2021 now error with this date
loanWithOldDates.loanOriginationDate = '09/03/2020';
loansToCreate.push(loanWithOldDates);

describe('Create Many Loan Types (Lender)', () => {
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

	// Create all loans
	for (const loan of loansToCreate) {
		createNewLoan({
			lenderAccount: newLenderAccount,
			loan: loan,
		});
	}

	deleteAllLoans({ email: newLenderAccount.email });
});
