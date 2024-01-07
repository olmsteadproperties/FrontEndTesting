import {
	newLenderAccount,
	newLoan,
	newBorrowerAccount,
	newPartnerAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
	differenceDays,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	changePlanLevel,
	createNewLoan,
	duplicateExistingLoan,
	addBorrower,
	setupPaymentAccount,
	checkEmails,
	addPartner,
	makePayment,
	schedulePayment,
	// deleteSchedulePayment,// for now not sent
	deletePaymentMethod,
	removeUserFromLoan,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

// hardcode numbers
newLoan.financedAmount = 30000;

// OneTime
const currentDate = Date.now();

let day = new Date(new Date(currentDate).setDate(1)).getDate();
let month = new Date(currentDate).setMonth(
	new Date(currentDate).getMonth() + 1
);
month = new Date(month).getMonth();

// was "...getFullYear() + 1" but now it's not working
let year = new Date(currentDate).getFullYear(); // temporary need  update it calcucation date not only numbers

if (+day < 10) day = day.toString().padStart(2, '0');
if (+month + 1 < 10) month = (month + 1).toString().padStart(2, '0');

const dateAsWeNeedFor_OneTime = `${month}/${day}/${year}`; // 07/01/2022 (next month, first day, current year)

if (+day < 10) {
	day = (+day + 1).toString().padStart(2, '0');
} else {
	day = +day + 1;
}

// Recurring
const dateAsWeNeedFor_Recurring = `${month}/${day}/${year}`; // 07/01/2022 (next month, first day, current year)

describe('Email History Working (Lender)', () => {
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

	// --------------------------------- "Welcome to Your Land Loans!" ---------------------------------

	addPartner({
		lenderEmail: newLenderAccount.email,
		partnerAccount: newPartnerAccount,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newPartnerAccount.email });

	// signup borrower
	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: newLoan.name,
	});

	acceptEmailInvite({ email: newBorrowerAccount.email });

	// set up payment method for borrower
	dwollaSignup({
		account: newBorrowerAccount,
		businessType: 'LLC',
		dowllaStatus: 'verified',
		isBorrower: true,
	});

	setupPaymentAccount({
		email: newBorrowerAccount.email,
		isIAV: true,
		bankName: `TD Bank`,
	});

	// --------------------------------- Title "Loan Payment Successfully Submitted" ---------------------------------
	const isHigherThanTen = differenceDays(
		newLoan.loanOriginationDate,
		newLoan.gracePeriod
	);
	makePayment({
		amount: isHigherThanTen ? '1020' : '1000',
		loanName: `${newLoan.name}`,
		dataOfStartLoan: newLoan.loanOriginationDate,
		lateFees: 0,
	});

	// --------------------------------- Title "Your Account has a new Loan!" ---------------------------------
	duplicateExistingLoan({
		email: newLenderAccount.email,
		loanName: newLoan.name,
	});

	// signup borrower
	addBorrower({
		borrowerAccount: newBorrowerAccount,
		lenderEmail: newLenderAccount.email,
		loanName: `${newLoan.name}_Duplicate`,
	});

	addPartner({
		lenderEmail: newLenderAccount.email,
		partnerAccount: newPartnerAccount,
		loanName: `${newLoan.name}_Duplicate`,
		checkLimit: true,
		submit: true,
	});

	// --------------------------------- Title "One Time Payment Scheduled for 04/01/2023" ---------------------------------
	const oneTimeAmount = 200;
	// One Time
	schedulePayment({
		isOneTimePayment: true,
		amount: oneTimeAmount,
		borrowerAccount: newBorrowerAccount,
		loanName: `${newLoan.name}`,
	});

	// --------------------------------- Title "Recurring Payments starting on 04/01/2023" ---------------------------------
	const recurringAmount = 800;
	// Recurring
	schedulePayment({
		isRecurringPayment: true,
		amount: recurringAmount,
		borrowerAccount: newBorrowerAccount,
		loanName: `${newLoan.name}`,
	});

	// for now not sent
	// // --------------------------------- Title "Scheduled Payments Cancelled" ---------------------------------
	// deleteSchedulePayment({
	// 	email: newBorrowerAccount.email,
	// 	loanName: `${newLoan.name}`,
	// });

	// --------------------------------- Title "Payment Method Removed" ---------------------------------
	deletePaymentMethod({
		email: newBorrowerAccount.email,
	});

	const arrData = [
		{
			email: newLenderAccount.email,
			receipentsEmail: newLenderAccount.email,
			loanName: `${newLoan.name}`,
			arrOfType: [`Loan Payment Successfully submitted`],
		},
		{
			email: newLenderAccount.email,
			receipentsEmail: newBorrowerAccount.email,
			loanName: `${newLoan.name}`,
			arrOfType: [
				`Recurring Payments starting on ${dateAsWeNeedFor_Recurring}`,
				`One Time Payment Scheduled for ${dateAsWeNeedFor_OneTime}`,
				`Loan Payment Successfully Submitted`,
				`Welcome to Your Land Loans!`,
				// `Scheduled Payments Cancelled`, // for now not sent
				`Payment Method Removed`,
			], // array of titles of letters
		},
		{
			email: newLenderAccount.email,
			receipentsEmail: newBorrowerAccount.email,
			loanName: `${newLoan.name}_Duplicate`,
			arrOfType: [`Your Account has a new Loan!`], // array of titles of letters
		},
		{
			email: newLenderAccount.email,
			receipentsEmail: newPartnerAccount.email,
			loanName: `${newLoan.name}`,
			arrOfType: [`Welcome to Your Land Loans!`], // array of titles of letters
		},
		// {
		// 	email: newLenderAccount.email,
		// 	receipentsEmail: newPartnerAccount.email,
		// 	loanName: `${newLoan.name}_Duplicate`,
		// 	arrOfType: [`Your Account has a new Loan!`], // array of titles of letters
		// },
	];

	arrData.map((el) => {
		checkEmails({
			email: el.email,
			receipentsEmail: el.receipentsEmail,
			loanName: el.loanName,
			arrOfType: el.arrOfType,
		});
	});

	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: newLoan.name,
		typeAccount: `Partner`,
	});

	removeUserFromLoan({
		email: newLenderAccount.email,
		userAccount: newPartnerAccount,
		loanName: `${newLoan.name}_Duplicate`,
		typeAccount: `Partner`,
	});

	deleteAllLoans({ email: newLenderAccount.email });
});
