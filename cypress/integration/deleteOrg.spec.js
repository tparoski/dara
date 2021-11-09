/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import acrhiveDel from "../models/archiveDeleteOrg"
import url from "../fixtures/url.json"
describe('delete org', () => {
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
        cy.archiveAllApi(token)
    });
    it('revert archive>no', () => {
        acrhiveDel.revertArchive.eq(0).click({ force: true })
        acrhiveDel.denyArchive.click({ force: true })
        acrhiveDel.checkIfOrgIsArchived(orgId)
        acrhiveDel.checkOrgStatusAPI("archived", token)
    });
    it('revert archive>yes', () => {
        acrhiveDel.revertArchive.eq(0).click({ force: true })
        acrhiveDel.confirmArchive.click({ force: true })
        cy.wait(2000)
        acrhiveDel.checkOrgStatusAPI("active", token)
        acrhiveDel.checkIfOrgIsActive(orgId)
    });
    it('delete without pass', () => {
        acrhiveDel.deleteOrg.click({ force: true })
        acrhiveDel.confirmArchive.should('be.disabled')
    });
    it('delete pass with spaces', () => {
        acrhiveDel.deleteOrgWithPass({ id: orgId, pass: data.strings.onlyspaces })
    });
    it('delete wrong pass', () => {
        acrhiveDel.deleteOrgWithPass({ id: orgId, pass: data.userInvalid.wrongPass })
    });
    it('delete for real', () => {
        acrhiveDel.deleteOrgWithPass({ id: orgId })
    });
})
