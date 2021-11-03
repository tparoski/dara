/// <reference types ="Cypress" />
import "cypress-localstorage-commands";
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import acrhiveDel from "../models/archiveDeleteOrg"
import boardModule from "../models/createBoardModule";
import createOrgModule from "../models/createOrgModule"
const ai = '../fixtures/media/invalid/ai.ai';
//const bmp = '../fixtures/media/invalid/bmp.bmp';
const docx = '../fixtures/media/invalid/docx.docx';
const eps = '../fixtures/media/invalid/eps.eps';
const pdf = '../fixtures/media/invalid/pdf.pdf';
//const psd = '../fixtures/media/invalid/psd.psd';
const svg = '../fixtures/media/invalid/svg.svg';
//const tiff = '../fixtures/media/invalid/tiff.tiff';
const zip = '../fixtures/media/invalid/zip.zip';
describe('create board without organization', () => {
    let token
    before(() => {
        cy.login().then((response) => {
            token = response

            cy.visit(url.myOrg)
            cy.wait(2000)
            acrhiveDel.archiveAllApi(token)
            acrhiveDel.deleteAllApi(token)
        })
    })
    beforeEach(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    it('unable without organization', () => {
        boardModule.addFromSideSomething.click()
        boardModule.addFromSideBoard.click()
        boardModule.errorImage.should('have.text', data.errors.org)
    });
});
describe('create board negative cases', () => {
    let token
    let id
    let count
    before(() => {
        cy.login().then((response) => {
            token = response
        })
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        createOrgModule.createOrgPositive({})
        cy.url().then((url) => {
            id = url.match(/^.+cypress.vivifyscrum-stage.com\/organizations\/(\d+)/)
            cy.url().should('eq', `${Cypress.config('baseUrl')}/organizations/${id[1]}/boards`)
        })
    });
    beforeEach(() => {
        cy.login()
        cy.intercept('GET', 'https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations').as('organizations')
        cy.visit(url.myOrg)
        cy.wait('@organizations').its('response.body')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        boardModule.countBoards(token).then(res => {
            console.log(res)
            count = res
        })
    });
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait('@organizations')
        cy.wait(2000)
        acrhiveDel.archiveAllApi(token)
        acrhiveDel.deleteAllApi(token)
    });
    it('next is dissabed without file name', () => {
        boardModule.boardName("")
        boardModule.nextBtn.should('be.disabled')
    });
    it('next is dissabed when there are spaces in filename', () => {
        boardModule.boardName("    ")
        boardModule.nextBtn.should('be.disabled')
    });
    it('not able to enter over 50 char', () => {
        boardModule.boardName(data.strings.string51)
        boardModule.modalBoardTitle.should('have.value', data.strings.string51.substring(0, 50))
    });
    it('upload ai', () => {
        boardModule.invalidImageBoard({ file: ai, boards: count })
    });
    // it('upload bmp', () => {
    //     boardModule.invalidImageBoard({file:bmp})
    // });
    it('upload docx', () => {
        boardModule.invalidImageBoard({ file: docx })
    });
    it('upload eps', () => {
        boardModule.invalidImageBoard({ file: eps })
    });
    it('upload pdf', () => {
        boardModule.invalidImageBoard({ file: pdf })
    });
    // it('upload psd', () => {
    //     boardModule.invalidImageBoard({file:psd})
    // });
    it('upload svg', () => {
        boardModule.invalidImageBoard({ file: svg })
    });
    // it('upload tiff', () => {
    //     boardModule.invalidImageBoard({file:tiff})
    // });
    it('upload zip', () => {
        boardModule.invalidImageBoard({ file: zip })
    });
});
