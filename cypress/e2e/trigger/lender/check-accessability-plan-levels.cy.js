import {
	newLenderAccount,
	newLoan,
	newTeamMemberAccount,
	newPartnerAccount,
} from '/cypress/support/yll/accounts';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

import {
	addLender,
	acceptEmailInvite,
	setupPaymentAccount,
	dwollaSignup,
	changePlanLevelTo,
	createNewLoan,
	addTeamMember,
	addPartner,
	deleteTeamMember,
	removeUserFromLoan,
	deleteAllLoans,
} from '/cypress/support/yll/actions';

// prepearing data
const newLoans = [];
for (let i = 0; i <= 25; i++) {
	newLoans.push({
		...newLoan,
		name: newLoan.name.replace(`Loan`, `Loan_${i}`),
	});
}

const newTeamMemberAccounts = [
	{
		...newTeamMemberAccount,
		email: newTeamMemberAccount.email.replace(`name_`, `name_1_`),
	},
	{
		...newTeamMemberAccount,
		email: newTeamMemberAccount.email.replace(`name_`, `name_2_`),
	},
];

const newPartnerAccounts = [
	{
		...newPartnerAccount,
		email: newPartnerAccount.email.replace(`name_`, `name_1_`),
	},
	{
		...newPartnerAccount,
		email: newPartnerAccount.email.replace(`name_`, `name_2_`),
	},
];

describe(
	'Check Accessability Plan Levels (Lender)',
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

		// -------------------------------------- Start --------------------------------------
		let countLoans = 0;
		const loanName = newLoan.name;

		// -------------------------------------- For "Free" --------------------------------------
		// Max Loans => 1
		const maxLoanFor_Free = 2; // must be more than max Loan for check correct work
		for (let i = 1; i <= maxLoanFor_Free; i++) {
			countLoans++;
			newLoan.name = `${loanName}_${countLoans}`;

			createNewLoan({
				lenderAccount: newLenderAccount,
				loan: newLoans[countLoans],
				checkLimit: i === maxLoanFor_Free ? true : false,
			});
		}

		// Team Member Accounts => -
		addTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberAccount: newTeamMemberAccount,
			checkLimit: true,
		});

		// Partner Accounts => -
		addPartner({
			lenderEmail: newLenderAccount.email,
			partnerAccount: newPartnerAccount,
			loanName: newLoans[countLoans - 1].name, // -1 because when we create the loans we have loans for testing for check plan-level limitations this loan not adding
			checkLimit: true,
		});

		// -------------------------------------- Change the plan level to "Starter" --------------------------------------
		changePlanLevelTo({ lenderAccount: newLenderAccount, toPlan: `Starter` });

		// Max Loans => 5
		const maxLoanFor_Starter = 5;
		for (let i = 1; i <= maxLoanFor_Starter; i++) {
			countLoans++;

			createNewLoan({
				lenderAccount: newLenderAccount,
				loan: newLoans[countLoans],
				checkLimit: i === maxLoanFor_Starter ? true : false,
			});
		}

		// Team Member Accounts => -
		addTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberAccount: newTeamMemberAccount,
			checkLimit: true,
		});

		// Partner Accounts => -
		addPartner({
			lenderEmail: newLenderAccount.email,
			partnerAccount: newPartnerAccount,
			loanName: newLoans[countLoans - 1].name, // -1 because when we create the loans we have loans for testing for check plan-level limitations this loan not adding
			checkLimit: true,
		});

		// -------------------------------------- Change the plan level to "Getting Serious" --------------------------------------
		changePlanLevelTo({
			lenderAccount: newLenderAccount,
			toPlan: `Getting Serious`,
		});

		// Max Loans => 15
		const maxLoanFor_GettingSerious = 11; // this number less then max count of loans because prev loan + currect loan
		for (let i = 1; i <= maxLoanFor_GettingSerious; i++) {
			countLoans++;

			createNewLoan({
				lenderAccount: newLenderAccount,
				loan: newLoans[countLoans],
				checkLimit: i === maxLoanFor_GettingSerious ? true : false,
			});
		}

		// Team Member Accounts => +
		addTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberAccount: newTeamMemberAccounts[0],
			checkLimit: false,
		});

		// Partner Accounts => +
		addPartner({
			lenderEmail: newLenderAccount.email,
			partnerAccount: newPartnerAccounts[0],
			loanName: newLoans[countLoans - 1].name, // -1 because when we create the loans we have loans for testing for check plan-level limitations this loan not adding
			checkLimit: false,
			submit: true,
		});

		// -------------------------------------- Change the plan level to "Full Tilt" --------------------------------------
		changePlanLevelTo({ lenderAccount: newLenderAccount, toPlan: `Full Tilt` });

		// Max Loans => Unlimited
		const maxLoanFor_FullTilt = 3; // this number less then max count of loans because prev loan + currect loan
		for (let i = 1; i <= maxLoanFor_FullTilt; i++) {
			countLoans++;

			createNewLoan({
				lenderAccount: newLenderAccount,
				loan: newLoans[countLoans],
				checkLimit: false,
			});
		}

		// Team Member Accounts => +
		addTeamMember({
			lenderEmail: newLenderAccount.email,
			teamMemberAccount: newTeamMemberAccounts[1],
			checkLimit: false,
		});

		// Partner Accounts => +
		addPartner({
			lenderEmail: newLenderAccount.email,
			partnerAccount: newPartnerAccounts[1],
			loanName: newLoans[countLoans - 1].name, // -1 because when we create the loans we have loans for testing for check plan-level limitations this loan not adding
			checkLimit: false,
			submit: true,
		});
		// -------------------------------------- End --------------------------------------

		for (let i = 0; i < newTeamMemberAccounts.length; i++) {
			deleteTeamMember({
				lenderEmail: newLenderAccount.email,
				teamMemberEmail: newTeamMemberAccounts[i].email,
			});
		}

		for (let i = 0; i < newPartnerAccounts.length; i++) {
			removeUserFromLoan({
				email: newLenderAccount.email,
				userAccount: newPartnerAccounts[i],
				loanName: newLoan.name,
				typeAccount: `Partner`,
			});
		}

		deleteAllLoans({ email: newLenderAccount.email });
	}
);

// -------------------------------------- The difference between the plans --------------------------------------
// Max Loans => 1	5	15	Unlimited ✅
// p Active Loan Limit Reached. Please Upgrade your Plan Here or remove unnecessary Loans.✅
// ACH Payment Transaction Fee => $2	$1.50	$1	$0.50 ❌ // situated on the back-end part
// Team Member Accounts => - - + + ✅
// Partner Accounts => - - + + ✅
// Automated Partner/Team Payments => - - - + ❌ // coming soon(for now not finished)
