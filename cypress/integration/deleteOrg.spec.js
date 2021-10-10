// <reference types ="Cypress" />
const org = require("../fixtures/addOrg.json")
const login = require("../fixtures/login.json")
const data = require("../fixtures/data.json")
describe('Delete org', () => {
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
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.confirmArchive).click({ force: true })
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.wait(5000)
    });
    beforeEach(() => {
        loginSession(data.user.email, data.user.password)
        cy.visit('/my-organizations')
    });
    it('delete without pass', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.confirmDelete)
    });
    it('delete pass with spaces', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type('   ')
        cy.get(org.delete.confirmDelete)
    });
    it('delete wrong pass', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type('wrongPass')
        cy.get(org.delete.confirmDelete).click()
        cy.get(org.errors.imageExtension)
    });
    it('delete for real', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.user.password)
        cy.get(org.delete.confirmDelete).click()
    });
});
