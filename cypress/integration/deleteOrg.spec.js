/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import nav from "../fixtures/navigation.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
const jpg = "../fixtures/media/valid/jpg.jpg"
describe('delete org', () => {
    let token
    let id
    before(() => {
        cy.login().then((response) => {
            token = response
        })
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations').as('orgCreated')
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.wait('@orgCreated').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(data.org.name3);
            expect(res.body.original_avatar).to.eq(null);
        })
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName).should('have.text', data.org.name3)
        cy.url().then((url) => {
            id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    })
    beforeEach(() => {
        cy.login()
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        cy.request({
            headers: {
                'authorization': "Bearer " + token,
            },
            method: 'PUT',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${id[1]}/status`,
            body: { "status": "archived" }
        })
    });
    it('revert archive>no', () => {
        cy.get(org.archive.revertArchive).eq(0).click({ force: true })
        cy.get(org.archive.denyArchive).click()
        cy.get(org.archivedOrg).children().should('have.length', 1)
        cy.get(org.activeOrg).children().should('have.length', 2)
        //sve znam
        cy.get("div[class='vs-c-my-organizations-item-wrapper vs-c-my-organizations-item-wrapper--archived']>div[id=" + id[1] + "]").should('exist')
    });
    it('revert archive>yes', () => {
        cy.intercept(`https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${id[1]}/status`).as('changeToActive')
        cy.get(org.archive.revertArchive).eq(0).click({ force: true })
        cy.get(org.archive.confirmArchive).click()
        cy.wait('@changeToActive').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.status).to.eq("active");
        })
        cy.get(org.activeOrg).children().should('have.length', 3)
        //jasno
        cy.get("div[class='vs-c-my-organizations-item-wrapper']>div[id=" + id[1] + "]").should('exist')
    });
    it('delete without pass', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.confirmDelete).should('be.disabled')
    });
    it('delete pass with spaces', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.strings.onlyspaces)
        cy.get(org.delete.confirmDelete).click()
        cy.get(org.errors.imageExtension).should('have.text', data.errors.pass)
    });
    it('delete wrong pass', () => {
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.userInvalid.wrongPass)
        cy.get(org.delete.confirmDelete).click()
        cy.get(org.errors.imageExtension).should('have.text', data.errors.pass)
    });
    it('delete for real', () => {
        cy.intercept('POST', `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${id[1]}`).as('delete')
        cy.get(org.delete.deleteOrg).click({ force: true })
        cy.get(org.delete.password).type(data.user.password)
        cy.get(org.delete.confirmDelete).click()
        cy.wait('@delete').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.id.toString()).to.eq(id[1]);
        })
    });
})
