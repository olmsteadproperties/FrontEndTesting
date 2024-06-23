/// <reference types="Cypress" />
/// <reference types='cypress' />

import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

import {
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
	downloanLoanData,
	dataToJSON,
	deleteLoan,
} from '/cypress/support/yll/actions';

let arrLoans = [
	{
		...newLoan,
		name: `${newLoan.name}(Download_1)`,
		salePrice: '30000',
		financedAmount: '30000',
		numberOfPayments: '30',
	},
	{
		...newLoan,
		name: `${newLoan.name}(Download_2)`,
	},
];

describe('Manage Download (Lender)', () => {
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

	// create all loans
	for (let i = 0; i < arrLoans.length; i++) {
		createNewLoan({
			lenderAccount: newLenderAccount,
			loan: arrLoans[i],
		});
	}

	// download, parse and check data
	for (let i = 0; i < arrLoans.length; i++) {
		downloanLoanData({
			loan: arrLoans[i],
			isCurrentLoan: i % 2 == 0, // "i % 2" it's for through one "true" and "false"
			isAllLoans: i % 2 !== 0,
		});

		dataToJSON({
			loan: arrLoans[i],
			nameOfFile:
				i % 2 == 0
					? arrLoans[i].name
					: `Loan Data For ${newLenderAccount.firstName} ${newLenderAccount.lastName}`,
		});
	}

	deleteLoan({
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
		withEdit: true,
	});
});
