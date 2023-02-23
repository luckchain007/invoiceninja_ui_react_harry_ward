/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
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
//

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      clearPermissions(): Chainable<void>;
      setPermission(permission: string): Chainable<void>;
      clearPermission(permission: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email?: string, password?: string) => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();

  cy.visit('/login').contains('Login');
  cy.get('#email').type(email ?? 'small@example.com');
  cy.get('#password').type(password ?? 'password');
  cy.get('[type=submit]').click();
});

Cypress.Commands.add('logout', () => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

Cypress.Commands.add('clearPermissions', () => {
  cy.get('[href*="/settings/company_details"]')
    .should('include.text', 'Settings')
    .click();

  cy.get('[href*="/settings/users"]')
    .should('include.text', 'User Management')
    .click();

  cy.get('[href*="/settings/users/Wpmbk5ezJn/edit"]')
    .should('include.text', 'Permissions Test')
    .click();

  cy.get('#current_password').type('password');

  cy.get('button').contains('Continue').click();

  cy.wait(2000);

  cy.get('button').contains('Permissions').click();

  cy.get('[data-cy="create_all"]')
    .check()
    .should('be.checked')
    .uncheck()
    .should('not.be.checked');

  cy.get('[data-cy="view_all"]')
    .check()
    .should('be.checked')
    .uncheck()
    .should('not.be.checked');

  cy.get('[data-cy="edit_all"]')
    .check()
    .should('be.checked')
    .uncheck()
    .should('not.be.checked');
});

Cypress.Commands.add('setPermission', (permission) => {
  cy.get(`[data-cy="${permission}"]`).check().should('be.checked');
});

Cypress.Commands.add('clearPermission', (permission) => {
  cy.get(`[data-cy="${permission}"]`).uncheck().should('not.be.checked');
});

export {};
