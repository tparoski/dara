/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import login from "../fixtures/login.json"
import data from "../fixtures/data.json"
import navigation from "../fixtures/navigation.json"
import faker from "faker"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
describe('archive and edit',() => {
    it('login', () => {
        cy.visit(url.login, { timeout: 30000 })
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait(3000)
    });
    it('create org', () => {
        cy.get(org.navigation.addNewOrganization, { timeout: 30000 }).click()
        cy.get(org.organizationName.organizationNameInput).type(data.org.nameArchive)
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.get(board.okBoardCreated, { timeout: 30000 }).click()
    });
    it('create board', () => {
        cy.get(navigation.homeButton).click()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.nameNoLogo)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
    });
    it('send to archive>no', () => {
        cy.get(navigation.homeButton).click()
        cy.get(board.edit.goToBoard).click()
        cy.get(board.edit.archive).click({ force: true })
        cy.get(board.edit.confirmArchive).click()
    });
    it('revert>yes', () => {
        cy.get(board.edit.revertArchive).click({ force: true })
        cy.get(board.edit.confirmArchive).click()
    });
    it('delete>yes', () => {
        cy.get(board.edit.archive).click({ force: true })
        cy.get(board.edit.confirmArchive).click()
        cy.get(board.edit.deleteBoard).click({ force: true })
        cy.get(board.edit.confirmArchive).click()
    });
});
