/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import "cypress-localstorage-commands";
import createOrgModule from "../models/createOrgModule"
import acrhiveDel from "../models/archiveDeleteOrg"
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
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations').as('logged')
        cy.visit(url.myOrg)
        cy.wait(2000)
        cy.wait('@logged').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
        })
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait(2000)
        acrhiveDel.archiveAllApi(token)
        acrhiveDel.deleteAllApi(token)
    })
    it('upload and delete', () => {
        createOrgModule.logoNegative("delete", gif)
    });
    it('upload and cancel', () => {
        createOrgModule.logoNegative("cancel", gif)
    });
    it('upload png and exit', () => {
        createOrgModule.logoNegative("exit", gif)
    });
    it('positive name unicode', () => {
        createOrgModule.createOrgPositive({ name: data.org.nameUnicode })
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    })
    it('without a logo', () => {
        createOrgModule.createOrgPositive({})
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    })
    it('positive with jpg', () => {
        createOrgModule.createOrgPositive({ file: jpg })
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    });
    it('positive with png', () => {
        createOrgModule.createOrgPositive({ file: png })
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    });
    it('positive with gif', () => {
        createOrgModule.createOrgPositive({ file: gif })
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    });
    it('positive with jpeg', () => {
        createOrgModule.createOrgPositive({ file: jpeg })
        cy.url().then((url) => {
            const id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    });
});
