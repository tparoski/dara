/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import login from "../fixtures/login.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
import sideBar from "../fixtures/sideBar.json"
describe('archive org', () => {
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
    it('delete without pass', () => {
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.confirmArchive).click({ force: true })
        cy.get(org.archive.findInArchive)
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.confirmDelete)
    });
    it('delete pass with spaces', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.strings.onlyspaces)
        cy.get(org.delete.confirmDelete)
    });
    it('delete wrong pass', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.userInvalid.wrongPass)
        cy.get(org.delete.confirmDelete).click()
        cy.get(org.errors.imageExtension)
    });
    it('delete for real', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.user.password)
        cy.get(org.delete.confirmDelete).click()
    });
})

