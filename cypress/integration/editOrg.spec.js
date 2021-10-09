/// <reference types ="Cypress" />
const org = require("../fixtures/addOrg.json")
const login = require("../fixtures/login.json")
const data = require("../fixtures/data.json")
const nav = require("../fixtures/navigation.json")
const sideBar = require("../fixtures/sideBar.json")
describe('edit org', () => {
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
    it('edit name to nothing', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear()
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('edit name only spaces', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type("         ")
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    //bug. only BE error , no FE
    it('change name to over 255  char', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type('NPCsvd9NfSKUAB07JEDuCOxgyf3IWLeaYWQ7Oqe5erN0HAjGLA5oku1LOUFFwg6qgtdCVnARxlEOHZBwwrTVtIl0EGSGUBHRV0VpJcVcB6G8DrX5sKzg9AFbJwYHMh3kH2pV0WSaYFXPYZztkHIOEyQZKcXud0xoe8kZgR4lrzzdDOe6FXO3wWScQXkf7xdSLH5FKWe638hjT6DCxjwkj73s6majxt6hHFsdQ6YyCaoPmBgs9vQUaoBTBWzXXiXj')
        cy.get(org.editOrganization.denyChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('give up on a change', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type("abv")
        cy.get(org.editOrganization.denyChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('positive', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.org.name2)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.wait(500)
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('positive 255 char', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.org.name255)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('positive unicode', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.org.nameUnicode)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
})
