/// <reference types='cypress' />

import {
	newLenderAccount,
	newLoan as baseLoan,
	newTeamMemberAccount,
} from '/cypress/support/yll/accounts';

import {
	randomString,
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
	addTeamMember,
	deleteTeamMember,
	deleteLoan,
} from '/cypress/support/yll/actions';

let loansToCreate = [];

// Loan with additional one time fees.
let loanWithFees = structuredClone(baseLoan);
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
let loanWithPercentFees = structuredClone(baseLoan);
loanWithPercentFees.name = `Cypress Test Loan With Percentage Fees ${randomString()}`;
loanWithPercentFees.lateFeeType = 'Percentage';
delete loanWithPercentFees.lateFeeAmountA;
loanWithPercentFees.lateFeeAmountP = '.1';
loansToCreate.push(loanWithPercentFees);

// Loan using the alternate inetest method of 365
let loanWithAltInterestMethod = structuredClone(baseLoan);
loanWithAltInterestMethod.name = `Cypress Test Loan With Alt Interest Method ${randomString()}`;
loanWithAltInterestMethod.daysInterestMethod = '365';
loansToCreate.push(loanWithAltInterestMethod);

// Backdated loan.
let loanWithOldDates = structuredClone(baseLoan);
loanWithOldDates.name = `Cypress Test Loan With Backdated Start ${randomString()}`;
loanWithOldDates.interestStartDate = '08/28/2021';
loanWithOldDates.paymentStartDate = '08/28/2021'; // was 06/27/2021 now error with this date
loanWithOldDates.loanOriginationDate = '09/03/2020';
loansToCreate.push(loanWithOldDates);

describe('Create Many Loan Types (Team Member)', () => {
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
		loan: baseLoan,
	});

	// Team Member
	addTeamMember({
		lenderEmail: newLenderAccount.email,
		teamMemberAccount: newTeamMemberAccount,
	});

	acceptEmailInvite({ email: newTeamMemberAccount.email });

	// Create all loans
	for (const loan of loansToCreate) {
		createNewLoan({
			lenderAccount: newTeamMemberAccount,
			loan: loan,
			moreThanOneLoan: true,
		});
	}

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
