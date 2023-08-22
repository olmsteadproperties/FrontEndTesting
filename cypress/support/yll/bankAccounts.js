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
};

export default bankAccounts;
