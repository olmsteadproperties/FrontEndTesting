import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import { checkAllLinks } from '/cypress/support/yll/actions';

describe('Check All Links (Lender)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	checkAllLinks();
});
