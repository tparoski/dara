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
        cy.get(sideBar.logout.logo).click()
        cy.get(sideBar.logout.me).click()
        cy.get(sideBar.logout.logout).click()
    });
    beforeEach(() => {
        cy.visit('/login')
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
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
