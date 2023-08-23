// import {
// 	newLenderAccount,
// 	newLoan,
// 	newBorrowerAccount,
// } from '/cypress/support/yll/accounts';

// import {
// 	clearAllLocalData,
// 	stopOnFirstFailure,
// 	differenceDays,
// } from '/cypress/support/yll/util';

// import {
// 	addLender,
// 	acceptEmailInvite,
// 	createNewLoan,
// 	dwollaSignup,
// 	setupPaymentAccount,
// 	verifyPaymentAccount,
// 	addBorrower,
// 	makePayment,
// 	deleteLoan,
// } from '/cypress/support/yll/actions';

// describe('Fail Payment (Borrower)', () => {
// 	before(() => {
// 		clearAllLocalData();
// 	});

// 	afterEach(function () {
// 		stopOnFirstFailure(this.currentTest);
// 	});

// 	// signup
// 	addLender({
// 		newLenderAccount: newLenderAccount,
// 	});

// 	acceptEmailInvite({ email: newLenderAccount.email });

// 	//set up payment method for lender
// 	dwollaSignup({
// 		account: newLenderAccount,
// 		businessType: 'LLC',
// 		dowllaStatus: 'verified',
// 	});

// 	setupPaymentAccount({
// 		email: newLenderAccount.email,
// 		specialBankName: `R01`, // R01 - it's an emulation for error for payment(only for testing on the dev version site )
// 	});

// 	verifyPaymentAccount({ email: newLenderAccount.email });

// 	createNewLoan({
// 		lenderAccount: newLenderAccount,
// 		loan: newLoan,
// 	});

// 	// signup borrower
// 	addBorrower({
// 		borrowerAccount: newBorrowerAccount,
// 		lenderEmail: newLenderAccount.email,
// 		loanName: newLoan.name,
// 	});

// 	acceptEmailInvite({ email: newBorrowerAccount.email });

// 	dwollaSignup({
// 		account: newBorrowerAccount,
// 		businessType: 'LLC',
// 		dowllaStatus: 'verified',
// 		isBorrower: true,
// 	});

// 	setupPaymentAccount({
// 		email: newBorrowerAccount.email,
// 		specialBankName: `R01`, // R01 - it's an emulation for error for payment(only for testing on the dev version site )
// 	});

// 	verifyPaymentAccount({ email: newBorrowerAccount.email });
// 	const isHigherThanTen = differenceDays(
// 		newLoan.loanOriginationDate,
// 		newLoan.gracePeriod
// 	); // add fees if outdated payment

// 	makePayment({
// 		amount: isHigherThanTen ? 1020 : 1020,
// 		loanName: newLoan.name,
// 		dataOfStartLoan: newLoan.loanOriginationDate,
// 	});
// });
