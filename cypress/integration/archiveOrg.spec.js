/// <reference types ="Cypress" />
import acrhiveDel from "../models/archiveDeleteOrg"
import url from "../fixtures/url.json"
describe('archive org', () => {
    let token
    let orgId
    before(() => {
        cy.login().then((response) => {
            token = response
            cy.createOrgApi(token).then(organizationId => {
                orgId = organizationId
            })
        });
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
        cy.archiveAllApi(token)
        cy.deleteAllApi(token)
    })
    it('archive>not', () => {
        acrhiveDel.archiveOrg.click({ force: true })
        acrhiveDel.denyArchive.click({ force: true })
        acrhiveDel.checkIfOrgIsActive(orgId)
        acrhiveDel.checkOrgStatusAPI("active", token)
    });
    it('archive>yes', () => {
        acrhiveDel.archiveOrg.click({ force: true })
        acrhiveDel.confirmArchive.click({ force: true })
        acrhiveDel.checkIfOrgIsArchived(orgId)
        acrhiveDel.checkOrgStatusAPI("archived", token)
    });
})
