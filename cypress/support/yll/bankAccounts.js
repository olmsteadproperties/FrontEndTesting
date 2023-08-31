// More accounts here: https://help.chargeover.com/en/articles/105-test-credit-card-numbers-and-test-ach-echeck-bank-account-numbers
import { generateAccountNumber } from './util';

const bankAccounts = {
	success: {
		routingNumber: '072403004',
		accountNumber: generateAccountNumber(6),
		description: 'ACH/eCheck Bank Accounts that Succeed', //https://help.chargeover.com/en/articles/105-test-credit-card-numbers-and-test-ach-echeck-bank-account-numbers
	},
	fail: {
		routingNumber: '072403004',
		accountNumber: generateAccountNumber(6),
		description:
			'ACH/eCheck bank account number that is rejected immediately, at the time of the transaction', //https://help.chargeover.com/en/articles/105-test-credit-card-numbers-and-test-ach-echeck-bank-account-numbers
	},
	dwalla: {
		routingNumber: '222222226',
		accountNumber: generateAccountNumber(6),
		description: 'Dwolla specific test account', //https://developers.dwolla.com/guides/sandbox#test-bank-account-numbers
	},
	dwalla_random_account: {
		routingNumber: '222222226',
		accountNumber: generateAccountNumber(6),
		description: 'Dwolla specific test account',
	},
	federal_reserve_boston: {
		routingNumber: '011000015',
		accountNumber: generateAccountNumber(6),
		description: 'FRB-BOS	Boston	FEDERAL RESERVE BANK OF BOSTON', //https://www.frbservices.org/EPaymentsDirectory/reserveInformation.html
	},
	// Testing Instant Match
	successPlaid: {
		institutionName: 'Houndstooth Bank (ins_109512)',
		username: 'user_good',
		password: 'pass_good',
		accountSelection: 'Plaid Savings (****1111)',
		routingNumber: '021000021',
		accountNumber: '1111222233331111',
	},
	failPlaid: {
		institutionName: '--',
		username: '--',
		password: '--',
		accountSelection: '--',
		routingNumber: '123456789',
		accountNumber: '1234567890123456',
	},
	// Testing Automated Micro-deposits
	successMicroDepositsPlaid: {
		institutionName: 'Houndstooth Bank (ins_109512)',
		username: 'user_good',
		password: 'microdeposits_good',
		accountSelection: 'Plaid Savings (****1111)',
		routingNumber: '021000021',
		accountNumber: '1111222233330000',
	},
	failMicroDepositsPlaid: {
		institutionName: '--',
		username: '--',
		password: '--',
		accountSelection: '--',
		routingNumber: '123456789',
		accountNumber: '1234567890123456',
	},
	// Testing Same Day Micro-deposits
	sameDayMicroDepositsPlaid: {
		routingNumber: 110000000,
		accountNumber: 1111222233330000,
		depositCode: 'ABC',
	},
};

export default bankAccounts;
