/// <reference types ="Cypress" />
import board from "../fixtures/addBoard.json"
import org from "../fixtures/addOrg.json"
import "cypress-localstorage-commands"
import data from "../fixtures/data.json"
import faker from "faker"
import url from "../fixtures/url.json"
import nav from "../fixtures/navigation.json"
const jpg = "../fixtures/media/valid/jpg.jpg"
const gif = '../fixtures/media/valid/gif.gif';
const jpeg = '../fixtures/media/valid/jpeg.jpeg';
const png = '../fixtures/media/valid/png.png';
describe('create board positive cases', () => {
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
        cy.get(board.logo.uploadlogo).attachFile(gif)
        cy.get(board.logo.deleteLogo).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
    });
    it('upload jpg and cancel', () => {
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
        cy.get(board.logo.uploadlogo).attachFile(jpeg)
        cy.get(board.logo.cancelLogo).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
    });
    it('upload png and exit', () => {
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(png)
        cy.get(board.logo.closeLogoModal).click({ force: true })
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
    });
    it('positive jpg, scrum', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.scrum).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle3)
        cy.get(board.logo.uploadlogo).attachFile(jpg)
        cy.get(board.logo.saveLogo).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', name)
        cy.intercept('GET', '**/saved-filters?type=tasks').as('tasks')
        cy.get(board.navigation.nextButton).click()
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id.toString()).to.eq(id[1]);
            expect(res.body.type).to.eq("scrum_board");
        })
        cy.wait('@avatar').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
        })
        cy.wait('@tasks')
        cy.get(nav.boardName).should('contain', name)
    });
    it('positive png, kanban', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        let name = faker.internet.domainName()
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(name)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle4)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(png)
        cy.get(board.logo.saveLogo).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', name)
        cy.intercept('GET', '**/saved-filters?type=tasks').as('tasks')
        cy.get(board.navigation.nextButton).click()
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id.toString()).to.eq(id[1]);
            expect(res.body.type).to.eq("kanban_board");
        })
        cy.wait('@avatar').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
        })
        cy.wait('@tasks')
        cy.get(nav.boardName).should('contain', name)
    });
    it('unicode name, gif image', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle)
        cy.get(board.newBoard.title).type(data.board.nameUnicode)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.modalTitle2)
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', "Import")
        cy.get(board.navigation.nextButton).click()
        cy.get(board.logo.uploadlogo).attachFile(gif)
        cy.wait(3000)
        cy.get(board.logo.saveLogo).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.modaltitle).should('contain', data.board.nameUnicode)
        cy.intercept('GET', '**/saved-filters?type=tasks').as('tasks')
        cy.get(board.navigation.nextButton).click()
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(data.board.nameUnicode);
            expect(res.body.organization_id.toString()).to.eq(id[1]);
            expect(res.body.type).to.eq("kanban_board");
        })
        cy.wait('@avatar').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
        })
        cy.wait('@tasks')
        cy.get(nav.boardName).should('contain', data.board.nameUnicode)
    });
    it('no logo, no config, no members', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.nameNoLogo)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.intercept('GET', '**/saved-filters?type=tasks').as('tasks')
        cy.get(board.navigation.nextButton).click()
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(data.board.nameNoLogo);
            expect(res.body.organization_id.toString()).to.eq(id[1]);
            expect(res.body.type).to.eq("kanban_board");
        })
        cy.wait('@tasks')
        cy.get(nav.boardName).should('contain', data.board.nameNoLogo)
    });
    it('board with members and config', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.get(board.addFromDashboard.addBoard).click()
        cy.get(board.newBoard.title).type(data.board.name3)
        cy.get(board.navigation.nextButton).click()
        cy.get(board.boardType.kanban).click()
        cy.get(board.navigation.nextButton).click()
        cy.get(board.import.configuration).click()
        cy.get(board.import.input).eq(0).type("Some{downarrow}{enter}")
        cy.get(board.import.members).click()
        cy.get(board.import.input).eq(1).type("Some{downarrow}{enter}")
        cy.get(board.navigation.nextButton).click()
        cy.get(board.navigation.nextButton).click()
        cy.intercept('GET', '**/saved-filters?type=tasks').as('tasks')
        cy.get(board.navigation.nextButton).click()
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(data.board.name3);
            expect(res.body.organization_id.toString()).to.eq(id[1]);
            expect(res.body.type).to.eq("kanban_board");
        })
        cy.wait('@tasks')
        cy.get(nav.boardName).should('contain', data.board.name3)
    });
});
