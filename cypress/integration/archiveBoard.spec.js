/// <reference types ="Cypress" />
import "cypress-localstorage-commands"
import url from "../fixtures/url.json"
import acrhiveDel from "../models/archiveDeleteOrg"
import archiveDeleteBoard from "../models/archiveDeleteBoard"
import sideBar from "../models/sideBarModule"
describe('archive board', () => {
    let token
    let organizationId
    let boardId
    before(() => {
        cy.login().then((response) => {
            token = response
            archiveDeleteBoard.createOrgApi(token).then(orgId => {
                organizationId = orgId
                archiveDeleteBoard.createBoardApi(token, orgId).then(board => {
                    boardId = board
                })
            })
        });
    })
    beforeEach(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        sideBar.clickOntheOrg(organizationId).click()
    });
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait(2000)
        acrhiveDel.archiveAllApi(token)
        acrhiveDel.deleteAllApi(token)
    })
    it('send to archive>no', () => {
        archiveDeleteBoard.archive.click({ force: true })
        archiveDeleteBoard.denyArchive.click()
        archiveDeleteBoard.activeParent.children().should('have.length', 3)
    });
    it('send to archive>yes', () => {
        cy.intercept('PUT', `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`).as('archived')
        archiveDeleteBoard.archive.click({ force: true })
        archiveDeleteBoard.confirmArchive.click({ force: true })
        cy.wait('@archived').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.status).to.eq("archived");
        })
        archiveDeleteBoard.archivedParent.children().should('have.length', 1)
    });
});
