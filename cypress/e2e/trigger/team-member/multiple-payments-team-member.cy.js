import {
	newLenderAccount,
	newTeamMemberAccount,
	newLoan,
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
	makeMultiplePayments,
	deleteTeamMember,
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
newLoan.salePrice = 1000;
newLoan.financedAmount = 1000;
newLoan.lateFeeAmountA = 10;
newLoan.numberOfPayments = 10;

describe(
	'Multiple Payments (Team Member)',
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

		// Team Member
		addTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberAccount: newTeamMemberAccount,
		});

		acceptEmailInvite({ email: newTeamMemberAccount.email });

		makeMultiplePayments({
			lenderAccount: newLenderAccount,
			loan: newLoan,
			amountPerMonth: 50,
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
	}
);
