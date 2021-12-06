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
import 'cypress-file-upload';
import sideBarModule from "../models/sideBarModule"
import data from "../fixtures/data.json"
import faker from "faker"
Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/login',
        body: {
            email: Cypress.env('validEmail'),
            password: Cypress.env('validPass')
        }
    }).its('body').then((response) => {
        window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('user_id', response.user.id)
        window.localStorage.setItem('organization_history', JSON.stringify({ "organizations": [{ "name": "home", "params": { "organizationId": 0 } }], "last_organization_id": 0 }))
        window.localStorage.setItem('user', JSON.stringify(response.user))
        return response.token
    })
})
Cypress.Commands.add('logOut', () => {
    cy.intercept('POST', '/api/v2/logout').as('loggedOut');
    sideBarModule.logo.should('be.visible').click();
    sideBarModule.me.should("be.visible").click();
    sideBarModule.logout.should("be.visible").click();
    cy.wait('@loggedOut').its("response").then((res) => {
        expect(res.statusCode).to.eq(201);
    })
})
Cypress.Commands.add('createOrgApi', (token) => {
    return cy.request({
        headers: {
            'authorization': "Bearer " + token,
        },
        method: 'POST',
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations`,
        body: {
            name: faker.animal.cat()
        }
    }).should((response) => {
        expect(response.status).to.eq(200)
    }).then(response => {
        return response.body.id
    })
})
Cypress.Commands.add('createBoardApi', (token, orgID) => {
    return cy.request({
        headers: {
            'authorization': "Bearer " + token,
        },
        method: 'POST',
        url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards',
        body: {
            name: faker.animal.dog(),
            type: "scrum_board",
            configuration_board_id: null,
            team_members_board_id: null,
            organization_id: orgID
        }
    }).should((response) => {
        expect(response.status).to.eq(201)
    }).then(response => {
        return response.body.id
    })
})
Cypress.Commands.add('archiveBoardAPI', (token, boardId) => {
    cy.request({
        headers: {
            'authorization': "Bearer " + token,
        },
        method: 'PUT',
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`,
        body: {
            status: "archived"
        }
    }).should((response) => {
        expect(response.status).to.eq(200)
    })
})
Cypress.Commands.add('archiveAllApi', (token) => {
    cy.get("div[class='vs-c-my-organizations-item-wrapper']").children().then(($children) => {
        for (var i = 0; i < $children.length; i++) {
            console.log($children[i].id)
            if ($children[i].id && !isNaN($children[i].id)) {
                cy.request({
                    headers: {
                        'authorization': "Bearer " + token,
                    },
                    method: 'PUT',
                    url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${$children[i].id}/status`,
                    body: { "status": "archived" }
                })
            }
        }
    })
})
Cypress.Commands.add('deleteAllApi', (token) => {
    cy.wait(2000)
    cy.get("body").then(($body) => {
        if ($body.find("div[class='vs-l-my-organizations__content']").children().length > 2) {
            cy.get("div[class='vs-c-my-organizations-item-wrapper vs-c-my-organizations-item-wrapper--archived']").children().then(($children) => {
                for (var i = 0; i < $children.length; i++) {
                    cy.request({
                        headers: {
                            'authorization': "Bearer " + token,
                        },
                        method: 'POST',
                        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${$children[i].id}`,
                        body: { passwordOrEmail: data.user.password }
                    })
                }
            })
        }
    })
})
Cypress.Commands.add('countBoards', (token) => {
    return cy.request({
        headers: {
            'authorization': "Bearer " + token,
        },
        method: 'GET',
        url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards/'
    }).then((response) => {
        return response.body.length
    })
})
