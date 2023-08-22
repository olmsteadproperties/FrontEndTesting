import {
	newLenderAccount,
	newLoan,
	newTeamMemberAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	createNewLoan,
	addLender,
	acceptEmailInvite,
	dwollaSignup,
	setupPaymentAccount,
	addTeamMember,
	changePlanLevel,
	editFees,
	checkAccessibility,
	changingLoanStatus,
	checkChanges,
	deleteTeamMember,
	deleteAllLoans,
	editLoan,
} from '/cypress/support/yll/actions';
import { middleOfPrevMonth } from '../../../support/yll/loans';

let dataForUpdate = {
	feeTitle: 'Fee title 1',
	charges: 10,
	achFlat: 2,
	achPercentage: 2.2,
	creditcardFlat: 4,
	creditcardPercentage: 4.4,
	amount: 20,
	lateFeePeriodDays: 20,
	state: 'Georgia (GA)',
	county: 'Gila County',
	parcelNumbers: '123-123, 123-123',
	name: `${newLoan.name}`,
	salePrice: '123,321',
	daysBeforeDefault: '12',
	interestStartDate: new Date(middleOfPrevMonth.setDate(17)).toLocaleDateString(
		'en-US',
		{ month: '2-digit', day: '2-digit', year: 'numeric' }
	),
	loanOriginationDate: new Date(
		middleOfPrevMonth.setDate(17)
	).toLocaleDateString('en-US', {
		month: '2-digit',
		day: '2-digit',
		year: 'numeric',
	}),
};

const arrEdite_1 = [
	{
		changeSection: `Payments`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Interest`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Miscellaneous`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Late Fees`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Transactional Fees`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Monthly Fees`,
		dataForUpdate: dataForUpdate,
	},
];

const arrEdite_2 = [
	{
		changeSection: `Payments`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Interest`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Miscellaneous`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Late Fees`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Transactional Fees`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Monthly Fees`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
];

const arrEdite_3 = [
	{
		changeSection: `Payments`,
		isDisabled: `second_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Interest`,
		isDisabled: `second_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Miscellaneous`,
		isDisabled: `second_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Late Fees`,
		isDisabled: `second_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Transactional Fees`,
		isDisabled: `second_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Monthly Fees`,
		isDisabled: `second_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
];

const arrEdite_4 = [
	{
		changeSection: `Payments`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Interest`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Miscellaneous`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Late Fees`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Transactional Fees`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
	{
		changeSection: `Monthly Fees`,
		isDisabled: `first_step_disabled`,
		dataForUpdate: dataForUpdate,
	},
];

const checkArray = ['Payments', 'Interest', 'Miscellaneous'];

describe(
	'Manage Edits (Team Member)',
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

		// Team Member
		addTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberAccount: newTeamMemberAccount,
		});

		acceptEmailInvite({ email: newTeamMemberAccount.email });

		for (let i = 0; i < arrEdite_1.length; i++) {
			if (checkArray.includes(arrEdite_1[i].changeSection)) {
				editLoan({
					changeSection: arrEdite_1[i].changeSection,
					dataForUpdate: arrEdite_1[i].dataForUpdate,
					isDisabled: arrEdite_1[i].isDisabled
						? arrEdite_1[i].isDisabled
						: false,
				});
			} else {
				editFees({
					changeSection: arrEdite_1[i].changeSection,
					dataForUpdate: arrEdite_1[i].dataForUpdate,
					isDisabled: arrEdite_1[i].isDisabled
						? arrEdite_1[i].isDisabled
						: false,
				});
			}
		}

		checkAccessibility({
			forStatus: `Active`,
			loanName: newLoan.name,
		});

		changingLoanStatus({
			currentStatusLoan: `Active`,
			nextStatusLoan: `Frozen`,
			loanName: newLoan.name,
		});

		for (let i = 0; i < arrEdite_2.length; i++) {
			if (checkArray.includes(arrEdite_2[i].changeSection)) {
				editLoan({
					changeSection: arrEdite_2[i].changeSection,
					dataForUpdate: arrEdite_2[i].dataForUpdate,
					isDisabled: arrEdite_2[i].isDisabled
						? arrEdite_2[i].isDisabled
						: false,
				});
			} else {
				editFees({
					changeSection: arrEdite_2[i].changeSection,
					dataForUpdate: arrEdite_2[i].dataForUpdate,
					isDisabled: arrEdite_2[i].isDisabled
						? arrEdite_2[i].isDisabled
						: false,
				});
			}
		}

		checkAccessibility({
			forStatus: `Frozen`,
			loanName: newLoan.name,
		});

		changingLoanStatus({
			currentStatusLoan: `Frozen`,
			nextStatusLoan: `PaidOff`,
			loanName: newLoan.name,
		});

		for (let i = 0; i < arrEdite_3.length; i++) {
			if (checkArray.includes(arrEdite_3[i].changeSection)) {
				editLoan({
					changeSection: arrEdite_3[i].changeSection,
					dataForUpdate: arrEdite_3[i].dataForUpdate,
					isDisabled: arrEdite_3[i].isDisabled
						? arrEdite_3[i].isDisabled
						: false,
				});
			} else {
				editFees({
					changeSection: arrEdite_3[i].changeSection,
					dataForUpdate: arrEdite_3[i].dataForUpdate,
					isDisabled: arrEdite_3[i].isDisabled
						? arrEdite_3[i].isDisabled
						: false,
				});
			}
		}

		checkAccessibility({
			forStatus: `PaidOff`,
			loanName: newLoan.name,
		});

		changingLoanStatus({
			currentStatusLoan: `PaidOff`,
			nextStatusLoan: `Cancelled`,
			loanName: newLoan.name,
		});

		for (let i = 0; i < arrEdite_4.length; i++) {
			editFees({
				changeSection: arrEdite_4[i].changeSection,
				dataForUpdate: arrEdite_4[i].dataForUpdate,
				isDisabled: arrEdite_4[i].isDisabled ? arrEdite_4[i].isDisabled : false,
			});
		}

		checkAccessibility({
			forStatus: `Cancelled`,
			loanName: newLoan.name,
		});

		changingLoanStatus({
			currentStatusLoan: `Cancelled`,
			nextStatusLoan: `Active`,
			loanName: newLoan.name,
		});

		checkChanges({ dataForUpdate });

		deleteTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberEmail: newTeamMemberAccount.email,
		});

		deleteAllLoans({ email: newLenderAccount.email });
	}
);
