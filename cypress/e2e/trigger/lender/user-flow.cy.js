import { accounts } from '/cypress/support/yll/accounts';

import { appPaths } from '/cypress/support/yll/paths';

import {
	clearAllLocalData,
	stopOnFirstFailure,
} from '/cypress/support/yll/util';

describe('User Flow (Lender)', () => {
	before(() => {
		clearAllLocalData();
	});

	afterEach(function () {
		stopOnFirstFailure(this.currentTest);
	});

	describe('Access prior to login', () => {
		const expectedSignInText = 'Sign in to Your Land Loans';

		before(() => {
			cy.visit(appPaths.allLoans);
		});

		it('Should restrict access if you have not logged in yet.', () => {
			cy.contains(expectedSignInText).should('have.length', 1);
		});
	});

	describe('Login Process', () => {
		beforeEach(() => {
			cy.visit(appPaths.base);
		});

		it('Should allow navigation to login page.', () => {
			cy.log('Should show field requirements when not entered');

			cy.contains('Email is required').should('have.length', 0);
			cy.contains('Password is required').should('have.length', 0);

			cy.contains('button', 'Login').click();

			cy.contains('Email is required').should('have.length', 1);
			cy.contains('Password is required').should('have.length', 1);
		});

		it('Should allow lender login', () => {
			cy.get('input[name="email"]').type(accounts.lender.email);
			cy.get('input[name="password"]').type(accounts.lender.password);
			cy.contains('button', 'Login').click();
		});
	});
});
