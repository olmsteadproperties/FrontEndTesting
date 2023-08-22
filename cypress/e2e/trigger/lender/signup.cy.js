import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	checkAddLenderValidation,
	addLender,
	acceptEmailInvite,
	getInformationLoan,
} from '/cypress/support/yll/actions';

describe(
	'Signup (Lender)',
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

		checkAddLenderValidation();

		addLender({
			newLenderAccount: newLenderAccount,
		});

		acceptEmailInvite({ email: newLenderAccount.email });

		getInformationLoan({ email: newLenderAccount.email });
	}
);
