/// <reference types ="Cypress" />
import board from "../fixtures/addBoard.json"
import "cypress-localstorage-commands";
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
describe('create board without organization', () => {
    beforeEach(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    it('unable without organization', () => {
        cy.get(board.addFromSidebarUp.addNewSomething).click()
        cy.get(board.addFromSidebarUp.addBoard).click()
        cy.get(board.errors.imageExtension).should('have.text', data.errors.org)
    });
})
