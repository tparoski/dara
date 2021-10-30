/// <reference types ="Cypress" />
import board from "../fixtures/addBoard.json"
import org from "../fixtures/addOrg.json"
import "cypress-localstorage-commands"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import nav from "../fixtures/navigation.json"
import faker from "faker"
describe('delete board', () => {
    let token
    let id
    let name = faker.company.companyName()
    let boardId
    before(() => {
        cy.login().then((response) => {
            token = response
        })
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations').as('orgCreated')
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.wait('@orgCreated').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(data.org.name);
            expect(res.body.original_avatar).to.eq(null);
        })
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName).should('have.text', data.org.name)
        cy.url().then((url) => {
            id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.get(board.addFromSidebarDown.addToNewOrg).click()
        cy.get(board.addFromSidebarDown.addBoardToNewOrg).click()
        cy.get(board.newBoard.title).type(name)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.intercept('GET', '**/saved-filters?type=tasks').as('tasks')
        cy.get(board.navigation.nextButton).click()
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id.toString()).to.eq(id[1]);
            expect(res.body.type).to.eq("scrum_board");
            boardId = res.body.id
        })
        cy.wait('@tasks')
        cy.get(nav.boardName).should('contain', name)
    });
    beforeEach(() => {
        cy.login()
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        cy.get(board.edit.goToBoard).click()
        cy.request({
            headers: {
                'authorization': "Bearer " + token,
            },
            method: 'PUT',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`,
            body: { "status": "archived" }
        })
    });
    after(() => {
        cy.login()
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.get("body").then(($body) => {
            if ($body.find(org.activeOrg).children().length > 2) {
                cy.get(org.activeOrg).children().then(($children) => {
                    for (var i = 0; i < $children.length - 2; i++) {
                        cy.request({
                            headers: {
                                'authorization': "Bearer " + token,
                            },
                            method: 'PUT',
                            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${$children[i].id}/status`,
                            body: { "status": "archived" }
                        })
                    }
                })
            }
        })
        cy.get("body").then(($body) => {
            if ($body.find(org.archivedOrgParent).children().length > 2) {
                cy.get(org.archivedOrg).children().then(($children) => {
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
    it('revert>no', () => {
        cy.get(board.edit.revertArchive).click({ force: true })
        cy.get(board.edit.denyArchive).click()
        cy.get(board.archivedParent).children().should('have.length', 1)
    });
    it('revert>yes', () => {
        cy.intercept('PUT', `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`).as('archived')
        cy.get(board.okBoardCreated).click()
        cy.get(board.edit.revertArchive).click({ force: true })
        cy.get(board.edit.confirmArchive).click()
        cy.wait('@archived').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(name);
            expect(res.body.status).to.eq("active");
        })
        cy.get(board.activeParent).children().should('have.length', 3)
    });
    it('delete>no', () => {
        cy.get(board.edit.deleteBoard).click({ force: true })
        cy.get(board.edit.denyArchive).click()
        cy.get(board.archivedParent).children().should('have.length', 1)
    });
    it('delete>yes', () => {
        cy.intercept('DELETE', `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`).as('deleted')
        cy.get(board.okBoardCreated).click()
        cy.get(board.edit.deleteBoard).click({ force: true })
        cy.get(board.edit.confirmArchive).click()
        cy.wait('@deleted').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(name);
            expect(res.body.status).to.eq("archived");
        })
    });
});
