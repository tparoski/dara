/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import data from "../fixtures/data.json"
import nav from "../fixtures/navigation.json"
import faker from "faker"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
import "cypress-localstorage-commands";
//nisam usela da koristim import za ove fajlove jer dobijam error u cypressu
const jpg = "../fixtures/media/valid/jpg.jpg"
const gif = '../fixtures/media/valid/gif.gif';
const jpeg = '../fixtures/media/valid/jpeg.jpeg';
const png = '../fixtures/media/valid/png.png';
describe('create org positive cases', () => {
    let token
    before(() => {
        cy.login().then((response) => {
            token = response
        })
        cy.saveLocalStorage();
    })
    beforeEach(() => {
        cy.restoreLocalStorage()
        cy.intercept('POST', '**organizations').as('organization')
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/login').as("login")
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    after(() => {
        cy.restoreLocalStorage()
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
    it('upload gif and delete', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(gif)
        cy.get(org.logo.modalHeader).should('have.text', data.org.uploadLogoTitle)
        cy.get(org.logo.deleteLogo).should('not.be.disabled').click()
        cy.get(org.modalTitle).should('have.text', title)
    });
    it('upload jpeg and cancel', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(jpeg)
        cy.get(org.logo.modalHeader).should('have.text', data.org.uploadLogoTitle)
        cy.get(org.logo.cancelLogo).should('not.be.disabled').click()
        cy.get(org.modalTitle).should('have.text', title)
    });
    it('upload png and exit', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(png)
        cy.get(org.logo.modalHeader).should('have.text', data.org.uploadLogoTitle)
        cy.get(org.navigation.closeModal).click()
        cy.get(org.modalTitle).should('have.text', title)
    });
    it('positive name unicode', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(data.org.nameUnicode)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.navigation.nextButton).click()
        cy.wait('@organization').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(data.org.nameUnicode);
            expect(res.body.original_avatar).to.eq(null);
        })
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName).should('have.text', data.org.nameUnicode)
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    })
    it('without a logo', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations').as('orgCreated')
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(data.org.name3)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.wait('@organization').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(data.org.name3);
            expect(res.body.original_avatar).to.eq(null);
        })
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName).should('have.text', data.org.name3)
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    })
    it('positive with jpg', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations').as('orgCreated')
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(data.org.name)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(jpg)
        cy.get(org.logo.modalHeader).should('have.text', data.org.uploadLogoTitle)
        cy.get(org.logo.saveLogo).should('not.be.disabled').click()
        cy.get(org.navigation.nextButton).click()
        cy.wait('@organization').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(data.org.name);
            expect(res.body.original_avatar).to.not.eq(null);
        })
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName).should('have.text', data.org.name)
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    });
});
