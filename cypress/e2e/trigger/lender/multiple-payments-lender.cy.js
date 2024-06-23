import { newLenderAccount, newLoan } from '/cypress/support/yll/accounts';

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
	makeMultiplePayments,
	deleteLoan,
} from '/cypress/support/yll/actions';

// dates for multiple payments
const interestStartDate = new Date();
new Date(interestStartDate.setDate(1));
new Date(interestStartDate.setMonth(interestStartDate.getMonth() - 50));

const paymentStartDate = interestStartDate;

const loanOriginationDate = interestStartDate;

newLoan.name = `Cypress Test Loan (Multiple payments) ${randomString()}`;
newLoan.interestStartDate = interestStartDate;
newLoan.paymentStartDate = paymentStartDate;
newLoan.loanOriginationDate = loanOriginationDate;
newLoan.interestRate = 0;
newLoan.salePrice = 100000;
newLoan.financedAmount = 100000;
newLoan.lateFeeAmountA = 10;
newLoan.numberOfPayments = 50;

describe(
	'Multiple Payments (Lender)',
	{
		viewportHeight: 1024,
	},
	() => {
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
			loan: newLoan,
		});

		makeMultiplePayments({
			lenderAccount: newLenderAccount,
			loan: newLoan,
			amountPerMonth: 1000,
			fees: 10,
		});

		deleteLoan({
			lenderEmail: newLenderAccount.email,
			loanName: newLoan.name,
			withEdit: true,
		});
	}
);
