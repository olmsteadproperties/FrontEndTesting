import {
	randomString,
	copyObject,
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import { newLenderAccount } from '/cypress/support/yll/accounts';

import loans from '/cypress/support/yll/loans';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	changePlanLevel,
	createNewLoan,
	changingLoanStatus,
	searchField,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

// dates for "Default"
const interestStartDate_Default = new Date();

if (interestStartDate_Default.getDate() >= 28) {
	new Date(
		interestStartDate_Default.setMonth(interestStartDate_Default.getMonth() - 2)
	);
} else {
	new Date(
		interestStartDate_Default.setMonth(interestStartDate_Default.getMonth() - 1)
	);
}

new Date(interestStartDate_Default.setDate(1));

const paymentStartDate_Default = new Date();

if (paymentStartDate_Default.getDate() >= 28) {
	new Date(
		paymentStartDate_Default.setMonth(paymentStartDate_Default.getMonth() - 2)
	);
} else {
	new Date(
		paymentStartDate_Default.setMonth(paymentStartDate_Default.getMonth() - 1)
	);
}

new Date(paymentStartDate_Default.setDate(20));

const loanOriginationDate_Default = interestStartDate_Default;

// -------------------------------------------------------------------------

// dates for "Grace period"
const interestStartDate_GracePeriod = new Date();

if (interestStartDate_GracePeriod.getDate() >= 28) {
	new Date(
		interestStartDate_GracePeriod.setMonth(
			interestStartDate_GracePeriod.getMonth() - 2
		)
	);
} else {
	new Date(
		interestStartDate_GracePeriod.setMonth(
			interestStartDate_GracePeriod.getMonth() - 1
		)
	);
}

new Date(interestStartDate_GracePeriod.setDate(25));

const paymentStartDate_GracePeriod = new Date();
new Date(paymentStartDate_GracePeriod.setDate(1));

const loanOriginationDate_GracePeriod = interestStartDate_GracePeriod;
// -------------------------------------------------------------------------

// dates for "Late"
const interestStartDate_Late = new Date();
new Date(
	interestStartDate_Late.setMonth(interestStartDate_Late.getMonth() - 1)
);

if (interestStartDate_Late.getDate() >= 28) {
	new Date(
		interestStartDate_Late.setMonth(interestStartDate_Late.getMonth() - 2)
	);
} else {
	new Date(
		interestStartDate_Late.setMonth(interestStartDate_Late.getMonth() - 1)
	);
}

new Date(interestStartDate_Late.setDate(20));

const paymentStartDate_Late = interestStartDate_Late;

const loanOriginationDate_Late = interestStartDate_Late;
// -------------------------------------------------------------------------

const arrLoans = [];

// generate three accounts for testing three cases
for (let i = 0; i < 6; i++) {
	let loan = copyObject(loans.basic);
	arrLoans.push(loan);
}

describe('Verify Loan Status (Borrower)', () => {
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

	arrLoans.forEach((loan, index) => {
		let nextStatusLoan;

		switch (index) {
			case 0: // Default
				loan.name = `Cypress Test Loan With Percentage Fees ${randomString()}`;
				loan.interestStartDate = interestStartDate_Default;
				loan.paymentStartDate = paymentStartDate_Default;
				loan.loanOriginationDate = loanOriginationDate_Default;
				loan.daysBeforeDefault = 5;
				loan.gracePeriod = 3;
				loan.financedAmount = 30300;
				loan.lateFeeType = 'Percentage';
				delete loan.lateFeeAmountA;
				loan.lateFeeAmountP = '.1';

				nextStatusLoan = null;
				break;
			case 1: // Grace period
				loan.name = `Cypress Test Loan With Extra Fees${randomString()}`;
				loan.interestStartDate = interestStartDate_GracePeriod;
				loan.paymentStartDate = paymentStartDate_GracePeriod;
				loan.loanOriginationDate = loanOriginationDate_GracePeriod;
				loan.daysBeforeDefault = 20;
				loan.gracePeriod = 20;
				loan.financedAmount = 33300;
				loan.additionalFees = [
					{
						name: 'Not Convenient Fee',
						charge: '5',
					},
					{
						name: 'Dont have a good face fee',
						charge: '200',
					},
				];
				nextStatusLoan = null;

				break;
			case 2: // Late
				loan.name = `Cypress Test Loan With Alt Interest Method ${randomString()}`;
				loan.interestStartDate = interestStartDate_Late;
				loan.paymentStartDate = paymentStartDate_Late;
				loan.loanOriginationDate = loanOriginationDate_Late;
				loan.daysBeforeDefault = 60;
				loan.gracePeriod = 5;
				loan.financedAmount = 90000;
				loan.daysInterestMethod = '365';
				nextStatusLoan = null;

				break;
			case 3: // Late(Frozen)
				loan.name = `Cypress Test Loan ${randomString()}`;
				loan.interestStartDate = '08/28/2021';
				loan.paymentStartDate = '08/28/2021'; // was 06/27/2021 now error with this date
				loan.loanOriginationDate = '09/03/2020';
				loan.daysBeforeDefault = 60;
				loan.gracePeriod = 5;
				loan.financedAmount = 99000;
				loan.daysInterestMethod = '365';
				nextStatusLoan = `PaidOff`;

				break;
			case 4: // Late(PaidOff)
				loan.name = `Cypress Test Loan ${randomString()}`;
				loan.interestStartDate = interestStartDate_Late;
				loan.paymentStartDate = paymentStartDate_Late;
				loan.loanOriginationDate = loanOriginationDate_Late;
				loan.daysBeforeDefault = 60;
				loan.gracePeriod = 5;
				loan.financedAmount = 13000;
				loan.daysInterestMethod = '365';
				nextStatusLoan = `Frozen`;

				break;
			case 5: // Late(Cancelled)
				loan.name = `Cypress Test Loan ${randomString()}`;
				loan.interestStartDate = interestStartDate_Late;
				loan.paymentStartDate = paymentStartDate_Late;
				loan.loanOriginationDate = loanOriginationDate_Late;
				loan.daysBeforeDefault = 60;
				loan.gracePeriod = 5;
				loan.financedAmount = 66000;
				loan.daysInterestMethod = '365';
				nextStatusLoan = `Cancelled`;

				break;

			default:
				break;
		}

		createNewLoan({
			lenderAccount: newLenderAccount,
			loan: loan,
		});

		if (nextStatusLoan) {
			changingLoanStatus({
				currentStatusLoan: `Active`,
				nextStatusLoan: nextStatusLoan,
				loanName: loan.name,
			});
		}

		searchField({
			loanName: loan.name,
			status: nextStatusLoan,
			balance: loan.financedAmount,
			days: loan.numberOfPayments,
		});
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
