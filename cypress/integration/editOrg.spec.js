/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import login from "../fixtures/login.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
import sideBar from "../fixtures/sideBar.json"
describe('edit org', () => {
    before(() => {
        cy.visit(url.login, {timeout: 30000})
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
        cy.get(org.navigation.addNewOrganization, {timeout: 30000}).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.get(board.okBoardCreated).click()
        cy.get(sideBar.logout.logo).click()
        cy.get(sideBar.logout.me).click()
        cy.get(sideBar.logout.logout).click()
    })
    beforeEach(() => {
        cy.visit(url.login, {timeout: 30000})
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
    })
    it('edit name to nothing', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear()
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('edit name only spaces', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.strings.onlyspaces)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    //bug. only BE error , no FE
    it('change name to over 255  char', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.strings.string256)
        cy.get(org.editOrganization.denyChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard)
    });
    it('give up on a change', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.strings.string5)
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
