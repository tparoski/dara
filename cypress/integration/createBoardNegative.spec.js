/// <reference types ="Cypress" />
import board from "../fixtures/addBoard.json"
import org from "../fixtures/addOrg.json"
import "cypress-localstorage-commands";
import data from "../fixtures/data.json"
import faker from "faker"
import url from "../fixtures/url.json"
import nav from "../fixtures/navigation.json"
const ai = '../fixtures/media/invalid/ai.ai';
//const bmp = '../fixtures/media/invalid/bmp.bmp';
const docx = '../fixtures/media/invalid/docx.docx';
const eps = '../fixtures/media/invalid/eps.eps';
const pdf = '../fixtures/media/invalid/pdf.pdf';
//const psd = '../fixtures/media/invalid/psd.psd';
const svg = '../fixtures/media/invalid/svg.svg';
//const tiff = '../fixtures/media/invalid/tiff.tiff';
const zip = '../fixtures/media/invalid/zip.zip';
describe('create board negative cases', () => {
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
        cy.get(org.organizationName.organizationNameInput).type(data.org.name)
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.get(org.navigation.nextButton).should('not.be.disabled').click()
        cy.wait('@orgCreated').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(data.org.name);
            expect(res.body.original_avatar).to.eq(null);
        })
        cy.get(board.okBoardCreated).click()
        cy.get(nav.organizationName).should('have.text', data.org.name)
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
    it('next is dissabed without file name', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.newBoard.organizationSelect).should('contain', data.org.name)
        cy.get(board.navigation.nextButton).should('be.disabled')
    });
    it('next is dissabed when there are spaces in filename', () => {
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.newBoard.organizationSelect).should('contain', data.org.name)
        cy.get(board.newBoard.title).type(data.strings.onlyspaces)
        cy.get(board.navigation.nextButton).should('be.disabled')
    });
    it('not able to enter over 50 char', () => {
        let fifty = data.strings.string51
        fifty = fifty.substring(0, fifty.length - 1);
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.newBoard.organizationSelect).should('contain', data.org.name)
        cy.get(board.newBoard.title).type(data.strings.string51)
        cy.get(board.newBoard.title).should('have.value', fifty)
        cy.get(board.navigation.nextButton).should('not.be.disabled')
    });
    it('upload ai', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(ai)
        cy.get(board.errors.imageExtension).should('be.visible')
    });
    // it('upload bmp', () => {
    // let name=faker.internet.domainName()
    // cy.get(board.addFromDashboard.addBoard).click()
    // cy.get(board.modaltitle).should('contain', data.board.modalTitle)
    // cy.get(board.newBoard.title).type(name)
    // cy.get(board.newBoard.organizationInput).click()
    // cy.get(board.navigation.nextButton).click()
    // cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
    // cy.get(board.boardType.scrum).click()
    // cy.get(board.navigation.nextButton).click()
    // cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
    // cy.get(board.logo.uploadlogo).attachFile(bmp)
    // cy.get(board.errors.imageExtension).should('be.visible')
    // });
    it('upload docx', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(docx)
        cy.get(board.errors.imageExtension).should('be.visible')
    });
    it('upload eps', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(eps)
        cy.get(board.errors.imageExtension).should('be.visible')
    });
    it('upload pdf', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(pdf)
        cy.get(board.errors.imageExtension).should('be.visible')
    });
    // it('upload psd', () => {
    // let name=faker.internet.domainName()
    // cy.get(board.addFromDashboard.addBoard).click()
    // cy.get(board.modaltitle).should('contain', data.board.modalTitle)
    // cy.get(board.newBoard.title).type(name)
    // cy.get(board.newBoard.organizationInput).click()
    // cy.get(board.navigation.nextButton).click()
    // cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
    // cy.get(board.boardType.scrum).click()
    // cy.get(board.navigation.nextButton).click()
    // cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
    // cy.get(board.logo.uploadlogo).attachFile(psd)
    // cy.get(board.errors.imageExtension).should('be.visible')
    // });
    it('upload svg', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(svg)
        cy.get(board.errors.imageExtension).should('be.visible')
    });
    // it('upload tiff', () => {
    //     let name=faker.internet.domainName()
    //     cy.get(board.addFromDashboard.addBoard).click()
    //     cy.get(board.modaltitle).should('contain', data.board.modalTitle)
    //     cy.get(board.newBoard.title).type(name)
    //     cy.get(board.newBoard.organizationInput).click()
    //     cy.get(board.navigation.nextButton).click()
    //     cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
    //     cy.get(board.boardType.scrum).click()
    //     cy.get(board.navigation.nextButton).click()
    //     cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
    //     cy.get(board.logo.uploadlogo).attachFile(tiff)
    //     cy.get(board.errors.imageExtension).should('be.visible')
    // });
    it('upload zip', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.newBoard.organizationInput).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(zip)
        cy.get(board.errors.imageExtension).should('be.visible')
    });
});
