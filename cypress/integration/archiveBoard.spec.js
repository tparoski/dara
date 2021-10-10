/// <reference types ="Cypress" />
const board = require("../fixtures/addBoard.json")
const org = require("../fixtures/addOrg.json")
const login = require("../fixtures/login.json")
const data = require("../fixtures/data.json")
describe('create board', () => {
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
        cy.get(org.organizationName.organizationNameInput).type("org2Archive")
        cy.get(org.navigation.nextButton).click()
        cy.get(org.navigation.nextButton).click()
        cy.wait(5000)
        cy.get(board.okBoardCreated).click()
        cy.get(board.addFromOrg.addBoard).contains('Add new Board').click()
        cy.get(board.newBoard.title).type("boardToArchive")
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
    });
    beforeEach(() => {
        loginSession(data.user.email, data.user.password)
        cy.wait(3000)
        cy.visit('/my-organizations')
        cy.get(board.edit.goToBoard).click()
        cy.get(board.okBoardCreated).click()
    });
    it('send to archive>no', () => {
        cy.get(board.edit.archive).click({force:true})
        cy.get(board.edit.denyArchive).click()
    });
    it('send to archive>yes', () => {
        cy.get(board.edit.archive).click({force:true})
        cy.get(board.edit.confirmArchive).click()
    });
    it('revert>no', () => {
        cy.get(board.edit.revertArchive).click({force:true})
        cy.get(board.edit.denyArchive).click()
    });
    it('revert>yes', () => {
        cy.get(board.edit.revertArchive).click({force:true})
        cy.get(board.edit.confirmArchive).click()
    });
    it('delete>no', () => {
        cy.get(board.edit.archive).click({force:true})
        cy.get(board.edit.confirmArchive).click()
        cy.wait(3000)
        cy.get(board.edit.deleteBoard).click({force:true})
        cy.get(board.edit.denyArchive).click()
    });
    it('delete>yes', () => {
        cy.get(board.edit.deleteBoard).click({force:true})
        cy.get(board.edit.confirmArchive).click()
    });
});
