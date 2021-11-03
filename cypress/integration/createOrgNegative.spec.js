/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import createOrgModule from "../models/createOrgModule"
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
        cy.login()
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
        createOrgModule.newOrg.click();
        createOrgModule.modalTitle.should("be.visible").and('have.text', data.org.titleNewOrg);
        createOrgModule.nextBtnModal.should('be.disabled')
    });
    it('next is dissabed when there are spaces', () => {
        createOrgModule.wrongFileType({ name: "   " })
        createOrgModule.nextBtnModal.should('be.disabled')
    });
    it('not able to enter over 50 char', () => {
        createOrgModule.wrongFileType({ name: data.strings.string51 })
        createOrgModule.organizationNameInput.invoke('val').its('length').should('eq', 50)
        createOrgModule.nextBtnModal.should('not.be.disabled')
    });
    it('upload ai', () => {
        createOrgModule.wrongFileType({ file: ai })
    });
    //bug
    //createOrgModule.wrongFileType(bmp)
    //});
    it('upload docx', () => {
        createOrgModule.wrongFileType({ file: docx })
    });
    it('upload eps', () => {
        createOrgModule.wrongFileType({ file: eps })
    });
    it('upload pdf', () => {
        createOrgModule.wrongFileType({ file: pdf })
    });
    //bug, pasce
    // it('upload psd', () => {
    // createOrgModule.wrongFileType(psd)
    // });
    it('upload svg', () => {
        createOrgModule.wrongFileType({ file: svg })
    });
    //ovde je bug ne javlja se validaciona poruka ali se image ne prikazuje
    // it('upload tiff', () => {
    // createOrgModule.wrongFileType(tiff)
    //});
    it('upload zip', () => {
        createOrgModule.wrongFileType({ file: zip })
    });
});
