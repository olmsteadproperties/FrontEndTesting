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
	verifyPaymentAccount,
	changePlanLevel,
	createNewLoan,
	addBorrower,
	makePayment,
	reviewLoanDetails,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

// dates for "Default"
const interestStartDate_Default = new Date();
new Date(
	interestStartDate_Default.setMonth(interestStartDate_Default.getMonth() - 1)
);
new Date(interestStartDate_Default.setDate(1));

const paymentStartDate_Default = new Date();

new Date(
	paymentStartDate_Default.setMonth(paymentStartDate_Default.getMonth() - 1)
);
new Date(paymentStartDate_Default.setDate(20));

const loanOriginationDate_Default = interestStartDate_Default;

// -------------------------------------------------------------------------
// dates for "Grace period"
const today = Date.now();
const interestStartDate_GracePeriod = new Date(
	new Date(today).setDate(new Date(today).getDate() - 10)
);

const paymentStartDate_GracePeriod = new Date(
	new Date(today).setDate(new Date(today).getDate() - 1)
);

const loanOriginationDate_GracePeriod = interestStartDate_GracePeriod;
// -------------------------------------------------------------------------

// dates for "Late"
const interestStartDate_Late = new Date();
new Date(
	interestStartDate_Late.setMonth(interestStartDate_Late.getMonth() - 1)
);
new Date(interestStartDate_Late.setDate(20));

const paymentStartDate_Late = interestStartDate_Late;

const loanOriginationDate_Late = interestStartDate_Late;
// -------------------------------------------------------------------------

const arrAccounts = [];

// generate three accounts for testing three cases
for (let i = 0; i < 3; i++) {
	const lastName = `last_name_${randomString()}`;

	const newBorrowerAccount = {
		firstName: 'Testy',
		lastName: lastName,
		email: Cypress.env('googleEmail').replace('@', `+borrower_${lastName}@`),
		dateCreated: new Date().toString(),
	};

	arrAccounts.push(newBorrowerAccount);
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

	arrAccounts.forEach((account, index) => {
		let loan = copyObject(loans.basic);

		let loanBalance = loan.financedAmount;
		let loanStatus;
		let lateFees;

		switch (index) {
			case 0:
				loanStatus = 'Default';
				loan.name = `Cypress Test Loan (Default) ${randomString()}`;
				loan.interestStartDate = interestStartDate_Default;
				loan.paymentStartDate = paymentStartDate_Default;
				loan.loanOriginationDate = loanOriginationDate_Default;
				loan.daysBeforeDefault = 5;
				loan.gracePeriod = 5;
				loan.financedAmount = 30000;
				lateFees = 0;
				break;
			case 1:
				loanStatus = 'Grace period';
				loan.name = `Cypress Test Loan (Grace period) ${randomString()}`;
				loan.interestStartDate = interestStartDate_GracePeriod;
				loan.paymentStartDate = paymentStartDate_GracePeriod;
				loan.loanOriginationDate = loanOriginationDate_GracePeriod;
				loan.daysBeforeDefault = 10;
				loan.gracePeriod = 10;
				loan.financedAmount = 50000;
				lateFees = 0;
				break;
			case 2:
				loanStatus = 'Late';
				loan.name = `Cypress Test Loan (Late) ${randomString()}`;
				loan.interestStartDate = interestStartDate_Late;
				loan.paymentStartDate = paymentStartDate_Late;
				loan.loanOriginationDate = loanOriginationDate_Late;
				loan.daysBeforeDefault = 60;
				loan.gracePeriod = 5;
				loan.financedAmount = 20000;
				lateFees = 20;
				break;

			default:
				break;
		}

		createNewLoan({
			lenderAccount: newLenderAccount,
			loan: loan,
		});

		// signup borrower
		addBorrower({
			borrowerAccount: account,
			lenderEmail: newLenderAccount.email,
			loanName: loan.name,
		});

		acceptEmailInvite({ email: account.email });

		reviewLoanDetails({
			loanName: loan.name,
			loanStatus: loanStatus,
			loanBalance: loanBalance,
			email: arrAccounts[index].email,
		});

		dwollaSignup({
			account: arrAccounts[index],
			businessType: 'LLC',
			dowllaStatus: 'verified',
			isBorrower: true,
		});

		setupPaymentAccount({
			email: account.email,
			isIAV: true,
			bankName: `TD Bank`,
		});

		makePayment({
			loanName: loan.name,
			email: arrAccounts[index].email,
			dataOfStartLoan: loan.loanOriginationDate,
			lateFeePeriod: loan.gracePeriod,
			lateFees,
		});

		reviewLoanDetails({
			loanName: loan.name,
			loanStatus: 'Current',
			loanBalance: loanBalance,
			email: arrAccounts[index].email,
		});
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
