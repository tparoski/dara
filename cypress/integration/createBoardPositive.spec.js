/// <reference types ="Cypress" />
import "cypress-localstorage-commands";
import faker from "faker";
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import boardModule from "../models/createBoardModule";
import nav from "../models/navModule"
const jpg = "../fixtures/media/valid/jpg.jpg"
const gif = '../fixtures/media/valid/gif.gif';
const jpeg = '../fixtures/media/valid/jpeg.jpeg';
const png = '../fixtures/media/valid/png.png';
describe('create board positive cases', () => {
    let token
    let orgId
    let count
    before(() => {
        cy.login().then((response) => {
            token = response
            cy.createOrgApi(token).then(organizationId => {
                orgId = organizationId
            })
        });
    });
    beforeEach(() => {
        cy.login()
        cy.intercept('GET', 'https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations').as('organizations')
        cy.visit(url.myOrg)
        cy.wait('@organizations')
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
        cy.countBoards(token).then(res => {
            count = res
        })
    });
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait('@organizations')
        cy.wait(2000)
        cy.archiveAllApi(token)
        cy.deleteAllApi(token)
    });
    it('jpg image', () => {
        const name = faker.internet.domainName()
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        boardModule.validBoard({ name: name, file: jpg, boards: count })
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id).to.eq(orgId);
            expect(res.body.type).to.eq("kanban_board");
            cy.wait('@avatar').its("response").then((res) => {
                expect(res.statusCode).to.eq(201);
            })
        })
        nav.boradName.should('contain', name)
    });
    it('png image', () => {
        const name = faker.internet.domainName()
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        boardModule.validBoard({ name: name, file: png, boards: count })
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id).to.eq(orgId);
            expect(res.body.type).to.eq("kanban_board");
            cy.wait('@avatar').its("response").then((res) => {
                expect(res.statusCode).to.eq(201);
            })
        })
        nav.boradName.should('contain', name)
    });
    it('gif image', () => {
        const name = faker.internet.domainName()
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        boardModule.validBoard({ name: name, file: gif, boards: count })
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id).to.eq(orgId);
            expect(res.body.type).to.eq("kanban_board");
            cy.wait('@avatar').its("response").then((res) => {
                expect(res.statusCode).to.eq(201);
            })
        })
        nav.boradName.should('contain', name)
    });
    it('jpeg image', () => {
        const name = faker.internet.domainName()
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        cy.intercept('POST', '**/avatar').as('avatar')
        boardModule.validBoard({ name: name, file: jpeg, boards: count })
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id).to.eq(orgId);
            expect(res.body.type).to.eq("kanban_board");
            cy.wait('@avatar').its("response").then((res) => {
                expect(res.statusCode).to.eq(201);
            })
        })
        nav.boradName.should('contain', name)
    });
    it('scrum board', () => {
        const name = faker.internet.domainName()
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        boardModule.validBoard({ name: name, boards: count, type: "scrum" })
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(name);
            expect(res.body.organization_id).to.eq(orgId);
            expect(res.body.type).to.eq("scrum_board");
        })
        nav.boradName.should('contain', name)
    });
    it('unicode name', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards').as('board')
        boardModule.validBoard({ name: data.board.nameUnicode, boards: count })
        cy.wait('@board').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
            expect(res.body.name).to.eq(data.board.nameUnicode);
            expect(res.body.organization_id).to.eq(orgId);
            expect(res.body.type).to.eq("kanban_board");
        })
        nav.boradName.should('contain', data.board.nameUnicode)
    });
});
