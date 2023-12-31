/// <reference types="Cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-iframe';
import { getAccount } from './yll/generatedAccounts';
import { login } from './yll/util';

// https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
Cypress.Commands.add('embeded', (isIframe, method, params) => {
	if (isIframe) {
		if (method === 'get') method = 'find';

		return cy.iframe()[method](...params);
	} else {
		params.push({ includeShadowDom: true });

		return cy[method](...params);
	}
});

Cypress.Commands.add('parseXlsx', (inputFile) => {
	return cy.task('parseXlsx', { filePath: inputFile });
});
