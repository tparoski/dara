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
import 'cypress-file-upload'
Cypress.Commands.add('loginThroughBackend', () => {
    cy.request({
        method : 'POST',
        url : 'https://cypress-api.vivifyscrum-stage.com/api/v2/login',
        body : {
            email: Cypress.env('validEmail'),
            password: Cypress.env('validPass'),
        }
    }).its('body').then((response) => {
        window.localStorage.setItem('token',response.token)
        window.localStorage.setItem('user_id',response.user.id)
        window.localStorage.setItem('user-666-section-organization-showed',true)
        window.localStorage.setItem('collapsed_sidebar',1000000000)
        window.localStorage.setItem('organization_history',{"organizations":[{"name":"home","params":{"organizationId":0}}],"last_organization_id":0})
        
    })
})

