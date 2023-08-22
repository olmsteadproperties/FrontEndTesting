const firstDayTheMonth = new Date();
new Date(firstDayTheMonth.setDate(1));

export const firstDayOfNextMonth = new Date(firstDayTheMonth);
firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1); ///01/08/2023

export const middleOfPrevMonth = new Date();
new Date(middleOfPrevMonth.setMonth(middleOfPrevMonth.getMonth() - 2));

if (middleOfPrevMonth.getDate() >= 28) {
	new Date(middleOfPrevMonth.setMonth(middleOfPrevMonth.getMonth() - 2));
} else {
	new Date(middleOfPrevMonth.setMonth(middleOfPrevMonth.getMonth() - 1));
}

new Date(middleOfPrevMonth.setDate(15));

const loans = {
	basic: {
		state: 'Arizona (AZ)',
		county: 'Maricopa County',
		parcelNumbers: '123-456, 789-012', //xxx-xxx, xxx-xxx
		name: 'Basic Loan',
		salePrice: '100000',
		financedAmount: '100000',
		interestRate: '0',
		daysInterestMethod: '360', //360, 365
		numberOfPayments: '30',
		daysBeforeDefault: '10',
		interestStartDate: middleOfPrevMonth.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
		}), // previusly month, date 1
		paymentStartDate: firstDayTheMonth.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
		}), // this month, date 1
		loanOriginationDate: middleOfPrevMonth.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
		}), // previusly month, date 1
		ballonPayment: firstDayOfNextMonth.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
		}),
		lateFeeType: 'Flat', //Flat, Percentage
		lateFeeAmountA: '20', //$123, 9.9% //based on lateFeeType 'Flat'
		// lateFeeAmountP: '.1', //$123, 9.9% //based on lateFeeType 'Percentage'
		gracePeriod: '10', //days
		achFlatFee: '1',
		achPercentage: '0.011',
		creditCardFlatFee: '2',
		creditCardPercentage: '2.2',
		additionalFees: [],
		// next month, date 1
		// additionalFees: [
		//     {
		//         name: '',
		//         charge: ''
		//     },
		//     {
		//         name: '',
		//         charge: ''
		//     }
		// ]
	},
};

export default loans;
