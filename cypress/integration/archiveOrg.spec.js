/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import nav from "../fixtures/navigation.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
const jpg = "../fixtures/media/valid/jpg.jpg"
describe('archive org', () => {
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
    })
    after(() => {
        cy.login()
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.get("body").then(($body) => {
            if ($body.find(org.activeOrg).children().length > 2) {
                cy.get(org.activeOrg).children().then(($children) => {
                    for (var i = 0; i < $children.length - 2; i++) {
                        cy.request({
                            headers: {
                                'authorization': "Bearer " + token,
                            },
                            method: 'PUT',
                            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${$children[i].id}/status`,
                            body: { "status": "archived" }
                        })
                    }
                })
            }
        })
        cy.get("body").then(($body) => {
            if ($body.find(org.archivedOrgParent).children().length > 2) {
                cy.get(org.archivedOrg).children().then(($children) => {
                    for (var i = 0; i < $children.length; i++) {
                        cy.request({
                            headers: {
                                'authorization': "Bearer " + token,
                            },
                            method: 'POST',
                            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${$children[i].id}`,
                            body: { passwordOrEmail: data.user.password }
                        })
                    }
                })
            }
        })
    })
    it('archive>not', () => {
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.denyArchive).click({ force: true })
        //znam, znam...ali ovo ostavljam ovde jer nisam srecna sa svojim  resenjima
        cy.get("div[class='vs-c-my-organizations-item-wrapper']>div[id=" + id[1] + "]").should('exist')
        cy.get("div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-child(3)").should('have.id', id[1])

    });
    it('archive>yes', () => {
        cy.intercept('PUT', `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${id[1]}/status`).as('archived')
        cy.get(org.archive.archiveOrg).click({ force: true })
        cy.get(org.archive.confirmArchive).click({ force: true })
        cy.wait('@archived').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.status).to.eq("archived");
        })
        cy.get(org.archivedOrg).children().should('have.length', 1)
        cy.get(org.activeOrg).children().should('have.length', 2)
        //sve znam
        cy.get("div[class='vs-c-my-organizations-item-wrapper vs-c-my-organizations-item-wrapper--archived']>div[id=" + id[1] + "]").should('exist')
    });
})
