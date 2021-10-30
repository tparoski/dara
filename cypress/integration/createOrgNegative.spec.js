/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import data from "../fixtures/data.json"
import faker from "faker"
import url from "../fixtures/url.json"
import "cypress-localstorage-commands";
const ai = '../fixtures/media/invalid/ai.ai';
//const bmp = '../fixtures/media/invalid/bmp.bmp';
const docx = '../fixtures/media/invalid/docx.docx';
const eps = '../fixtures/media/invalid/eps.eps';
const pdf = '../fixtures/media/invalid/pdf.pdf';
//const psd = '../fixtures/media/invalid/psd.psd';
const svg = '../fixtures/media/invalid/svg.svg';
//const tiff = '../fixtures/media/invalid/tiff.tiff';
const zip = '../fixtures/media/invalid/zip.zip';
describe('create org negative cases', () => {
    let token
    before(() => {
        cy.login().then((response) => {
            token = response
        })
        cy.saveLocalStorage();
    })
    beforeEach(() => {
        cy.restoreLocalStorage()
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    it('next is dissabed without file name', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.navigation.nextButton).should('be.disabled')
    });
    it('next is dissabed when there are spaces', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type("   ")
        cy.get(org.navigation.nextButton).should('be.disabled')
    });
    it('not able to enter over 50 char', () => {
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(data.strings.string51)
        cy.get(org.organizationName.organizationNameInput).invoke('val').its('length').should('eq', 50)
        cy.get(org.navigation.nextButton).should('not.be.disabled')
    });
    it('upload ai', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.modalTitle).should('have.text', title)
        cy.get(org.logo.uploadlogo).attachFile(ai)
        cy.get(org.errors.imageExtension).should('be.visible')
            .and('have.text', data.errors.logo)
    });
    //bug
    // it('upload bmp', () => {
    //     cy.get(org.navigation.addNewOrganization).click()
    //     cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
    //     cy.get(org.navigation.nextButton).click()
    //     cy.get(org.logo.uploadlogo).attachFile(bmp)
    //cy.get(org.errors.imageExtension)
    //});
    it('upload docx', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(docx)
        cy.get(org.errors.imageExtension).should('be.visible')
            .and('have.text', data.errors.logo)
    });
    it('upload eps', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(eps)
        cy.get(org.errors.imageExtension).should('be.visible')
            .and('have.text', data.errors.logo)
    });
    it('upload pdf', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(pdf)
        cy.get(org.errors.imageExtension).should('be.visible')
            .and('have.text', data.errors.logo)
    });
    //bug, pasce
    // it('upload psd', () => {
    //     cy.get(org.navigation.addNewOrganization).click()
    //     cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
    //     cy.get(org.navigation.nextButton).click()
    //     cy.get(org.logo.uploadlogo).attachFile(psd)
    //cy.get(org.errors.imageExtension)
    // });
    it('upload svg', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(svg)
        cy.get(org.errors.imageExtension).should('be.visible')
            .and('have.text', data.errors.logo)
    });
    //ovde je bug ne javlja se validaciona poruka ali se image ne prikazuje
    // it('upload tiff', () => {
    //     cy.get(org.navigation.addNewOrganization).click()
    //     cy.get(org.organizationName.organizationNameInput).type(faker.company.companyName())
    //     cy.get(org.navigation.nextButton).click()
    //     cy.get(org.logo.uploadlogo).attachFile(tiff)
    //cy.get(org.errors.imageExtension)
    //});
    it('upload zip', () => {
        const title = faker.company.companyName()
        cy.get(org.navigation.addNewOrganization).click()
        cy.get(org.modalTitle).should('have.text', data.org.titleNewOrg)
        cy.get(org.organizationName.organizationNameInput).type(title)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.logo.uploadlogo).attachFile(zip)
        cy.get(org.errors.imageExtension).should('be.visible')
            .and('have.text', data.errors.logo)
    });

});
