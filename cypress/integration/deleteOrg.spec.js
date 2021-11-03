/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import acrhiveDel from "../models/archiveDeleteOrg"
import url from "../fixtures/url.json"
import createOrgModule from "../models/createOrgModule"
describe('delete org', () => {
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
        acrhiveDel.archiveAllApi(token)
    });
    it('revert archive>no', () => {
        acrhiveDel.revertArchive.eq(0).click({ force: true })
        acrhiveDel.denyArchive.click({ force: true })
        acrhiveDel.checkIfOrgIsArchived(id[1])
        acrhiveDel.checkOrgStatusAPI("archived", token)
    });
    it('revert archive>yes', () => {
        acrhiveDel.revertArchive.eq(0).click({ force: true })
        acrhiveDel.confirmArchive.click({ force: true })
        cy.wait(2000)
        acrhiveDel.checkOrgStatusAPI("active", token)
        acrhiveDel.checkIfOrgIsActive(id[1])
    });
    it('delete without pass', () => {
        acrhiveDel.deleteOrg.click({ force: true })
        acrhiveDel.confirmArchive.should('be.disabled')
    });
    it('delete pass with spaces', () => {
        acrhiveDel.deleteOrgWithPass({ id: id[1], pass: data.strings.onlyspaces })
    });
    it('delete wrong pass', () => {
        acrhiveDel.deleteOrgWithPass({ id: id[1], pass: data.userInvalid.wrongPass })
    });
    it('delete for real', () => {
        acrhiveDel.deleteOrgWithPass({ id: id[1] })
    });
})
