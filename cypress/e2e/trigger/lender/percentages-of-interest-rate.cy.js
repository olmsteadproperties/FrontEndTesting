import {
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
	deleteLoan,
} from '/cypress/support/yll/actions';

// -------------------------------------------------------------------------

const arrLoans = [];

// generate three accounts for testing three cases
for (let i = 0; i < 4; i++) {
	let loan = structuredClone(loans.basic);
	arrLoans.push(loan);
}

describe('Percentages of interest rate(Lender)', () => {
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
		loan.salePrice = 10000;
		loan.financedAmount = 10000;

		switch (index) {
			case 0:
				loan.interestRate = 5;
				loan.name = `Loan with interestRate_5%`;

				break;
			case 1:
				loan.interestRate = 9.9;
				loan.name = `Loan with interestRate_9.9%`;

				break;
			case 2:
				loan.interestRate = 11.25;
				loan.name = `Loan with interestRate_11.25%`;

				break;
			case 3:
				loan.interestRate = 12.125;
				loan.name = `Loan with interestRate_12.125%`;

				break;

			default:
				break;
		}

		createNewLoan({
			lenderAccount: newLenderAccount,
			loan: loan,
		});
	});

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
