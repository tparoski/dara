/// <reference types ="Cypress" />
import "cypress-localstorage-commands"
import url from "../fixtures/url.json"
import archiveDeleteBoard from "../models/archiveDeleteBoard"
import sideBar from "../models/sideBarModule"
import faker from "faker"
import board from "../models/createBoardModule"
describe('delete board', () => {
    let token
    let organizationId
    let boardId
    let name = faker.company.companyName()
    before(() => {
        cy.login().then((response) => {
            token = response
            cy.createOrgApi(token).then(orgId => {
                organizationId = orgId
                cy.createBoardApi(token, orgId).then(board => {
                    boardId = board
                })
            })
        });
    })
    beforeEach(() => {
        cy.login()
        cy.archiveBoardAPI(token, boardId)
        cy.visit(url.myOrg)
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        sideBar.clickOntheOrg(organizationId).click()
        board.okBoard.click()
    });
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait(2000)
        cy.archiveAllApi(token)
        cy.deleteAllApi(token)
    })
    it('revert>no', () => {
        archiveDeleteBoard.revertArchive.click({ force: true })
        archiveDeleteBoard.denyArchive.click({ force: true })
        archiveDeleteBoard.archivedParent.children().should('have.length', 1)
    });
    it('revert>yes', () => {
        cy.intercept('PUT', `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`).as('archived')
        archiveDeleteBoard.revertArchive.click({ force: true })
        archiveDeleteBoard.confirmArchive.click({ force: true })
        cy.wait('@archived').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.status).to.eq("active");
        })
        archiveDeleteBoard.activeParent.children().should('have.length', 3)
    });
    it('delete>no', () => {
        archiveDeleteBoard.deleteBoard.click({ force: true })
        archiveDeleteBoard.denyArchive.click({ force: true })
        archiveDeleteBoard.archivedParent.children().should('have.length', 1)
    });
    it('delete>yes', () => {
        cy.intercept('DELETE', `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`).as('deleted')
        archiveDeleteBoard.deleteBoard.click({ force: true })
        archiveDeleteBoard.confirmArchive.click({ force: true })
        cy.wait('@deleted').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.status).to.eq("archived");
        })
    });
});
