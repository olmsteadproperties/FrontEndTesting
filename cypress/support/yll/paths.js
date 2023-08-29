const devAppUrl = Cypress.env('devAppUrl');
const prodAppUrl = Cypress.env('prodAppUrl');

const appPaths = {
	base: '',
	login: '/login',
	loansAddUser: '/dashboard/loans/addUserToLoan',
	loansMakePayment: '/dashboard/makePayment',
	loansMakeManualPayment: '/dashboard/payment',
	paymentAdd: '/dashboard/addPaymentAccount',
	paymentMethods: '/dashboard/paymentMethods',
	addNewLoan: '/dashboard/loans/addNewLoan',
	editLoan: '/dashboard/editLoan',
	allLoans: '/dashboard/loans',
	dashboard: '/dashboard',
	billing: '/dashboard/billing',
	scheduledPayments: '/dashboard/scheduledPayments',
	profile: '/dashboard/profile',
	addBorrowerPaymentMethod: '/dashboard/addBorrowerPaymentMethod',
	teamMembers: '/dashboard/teamMembers',
	accountPreferences: '/dashboard/AccountPreferences',
};

const devMarketingSiteUrl = Cypress.env('devMarketingSiteUrl');

const marketingSitePaths = {
	base: '',
	signup: '/signup',
	allLoans: '/dashboard/loans',
};

const GetPaths = (base, paths) => {
	const fullPaths = {};

	for (const [key, value] of Object.entries(paths)) {
		fullPaths[key] = base + value;
	}

	return fullPaths;
};

export default {
	appPaths: GetPaths(devAppUrl, appPaths),
	marketingPaths: GetPaths(devMarketingSiteUrl, marketingSitePaths),
};
