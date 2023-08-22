import { newLenderAccount } from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	changePlanLevel,
	acceptEmailInvite,
	setupPaymentAccount,
	dwollaSignup,
} from '/cypress/support/yll/actions';

describe(
	'Upgrading Lenders Payment Plans (Lender)',
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
		changePlanLevel({ lenderAccount: newLenderAccount });
	}
);
