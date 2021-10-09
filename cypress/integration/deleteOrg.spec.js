// <reference types ="Cypress" />
const org = require("../fixtures/addOrg.json")
const login = require("../fixtures/login.json")
const data = require("../fixtures/data.json")
const nav = require("../fixtures/navigation.json")
const sideBar = require("../fixtures/sideBar.json")
describe('create org', () => {
    before(() => {
        cy.visit('/login')
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.confirmArchive).click({ force: true })
        cy.get(sideBar.logout.logo).click({force:true})
        cy.get(sideBar.logout.me).click({force:true})
        cy.get(sideBar.logout.logout).click({force:true})
    });
    beforeEach(() => {
        cy.visit('/login')
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
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
