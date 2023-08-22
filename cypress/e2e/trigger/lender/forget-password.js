import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	forgotPassword,
} from '/cypress/support/yll/actions';

describe(
	'Forget Password (Lender)',
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

		forgotPassword({ email: newLenderAccount.email });
	}
);
