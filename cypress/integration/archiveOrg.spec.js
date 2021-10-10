// <reference types ="Cypress" />
const org = require("../fixtures/addOrg.json")
const login = require("../fixtures/login.json")
const data = require("../fixtures/data.json")
describe('archive org', () => {
    const loginSession = (email, password) => {
        cy.session([email, password], () => {
            cy.visit('', { timeout: 30000 })
            cy.get(login.form.emailLogin).clear().type(email)
            cy.get(login.form.passwordLogin).clear().type(password)
            cy.get(login.form.loginButton).click()
            cy.wait(3000)
        })
    }
    before(() => {
        loginSession(data.user.email, data.user.password)
        cy.visit('/my-organizations')
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.wait(5000)
    });
    beforeEach(() => {
        loginSession(data.user.email, data.user.password)
        cy.visit('/my-organizations')
    });
    it('archive>not', () => {
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.denyArchive).click({ force: true })
    });
    it('archive>yes', () => {
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.confirmArchive).click({ force: true })
        cy.get(org.archive.findInArchive)
    });
    it('revert archive>no', () => {
        cy.get(org.archive.revertArchive).eq(0).click({ force: true })
        cy.get(org.archive.denyArchive).click()
        cy.get(org.archive.findInArchive)
    });
    it('revert archive>yes', () => {
        cy.get(org.archive.revertArchive).eq(0).click({ force: true })
        cy.get(org.archive.confirmArchive).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
})
