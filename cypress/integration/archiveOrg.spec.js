/// <reference types ="Cypress" />
import acrhiveDel from "../models/archiveDeleteOrg"
import url from "../fixtures/url.json"
import createOrgModule from "../models/createOrgModule"
describe('archive org', () => {
    let token
    let id
    before(() => {
        cy.login().then((response) => {
            token = response
        })
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        createOrgModule.createOrgPositive({})
        cy.url().then((url) => {
            id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    })
    beforeEach(() => {
        cy.login()
        cy.intercept('GET', 'https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations').as('organizations')
        cy.visit(url.myOrg)
        cy.wait('@organizations').its('response.body')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait('@organizations')
        cy.wait(2000)
        acrhiveDel.archiveAllApi(token)
        acrhiveDel.deleteAllApi(token)
    })
    it('archive>not', () => {
        acrhiveDel.archiveOrg.click({ force: true })
        acrhiveDel.denyArchive.click({ force: true })
        acrhiveDel.checkIfOrgIsActive(id[1])
        acrhiveDel.checkOrgStatusAPI("active", token)
    });
    it('archive>yes', () => {
        acrhiveDel.archiveOrg.click({ force: true })
        acrhiveDel.confirmArchive.click({ force: true })
        acrhiveDel.checkIfOrgIsArchived(id[1])
        acrhiveDel.checkOrgStatusAPI("archived", token)
    });
})
