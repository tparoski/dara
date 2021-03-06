/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import createOrgModule from "../models/createOrgModule"
import faker from "faker"
describe('edit org', () => {
    let token
    let orgId
    let orgName
    before(() => {
        cy.login().then((response) => {
            token = response
            cy.createOrgApi(token).then(organizationId => {
                orgId = organizationId
            })
        });
    })
    beforeEach(() => {
        cy.login()
        cy.intercept('GET', 'https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations').as('organizations')
        cy.visit(url.myOrg)
        cy.wait('@organizations').its('response.body').then((res) => {
            orgName = res[res.length - 1].name
        })
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    })
    after(() => {
        cy.login()
        cy.visit(url.myOrg)
        cy.wait('@organizations')
        cy.wait(2000)
        cy.archiveAllApi(token)
        cy.deleteAllApi(token)
    })
    it('edit name to nothing', () => {
        createOrgModule.editOrgName.click();
        createOrgModule.editNameInput.should('be.visible').clear()
        createOrgModule.confirmOrgName.should('be.visible').click();
        createOrgModule.checkOrgNameDashboard.should('contain', orgName.substring(0, 16))
    });
    it('edit name only spaces', () => {
        createOrgModule.editOrgName.click();
        createOrgModule.editNameInput.should('be.visible').clear().type("   ")
        createOrgModule.confirmOrgName.should('be.visible').click();
        createOrgModule.checkOrgNameDashboard.should('contain', orgName.substring(0, 16))
    });
    //bug. only BE error , no FE
    it('change name to over 255  char', () => {
        cy.intercept('PUT', `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`).as('orgNameEdit');
        createOrgModule.editOrgName.click();
        createOrgModule.editNameInput.should('be.visible').clear().type(data.strings.string256);
        createOrgModule.confirmOrgName.should('be.visible').click();
        cy.wait('@orgNameEdit').its("response").then((res) => {
            expect(res.statusCode).to.eq(422);
        })

    });
    it('give up on a change', () => {
        createOrgModule.editOrgName.click();
        createOrgModule.editNameInput.should('be.visible').clear().type(data.org.name)
        createOrgModule.denyOrgName.click()
        createOrgModule.checkOrgNameDashboard.should('contain', orgName.substring(0, 16))
    });
    it('positive', () => {
        createOrgModule.editOrgName2(orgId, faker.company.companyName())
    });
    it('positive 255 char', () => {
        createOrgModule.editOrgName2(orgId, data.org.name255)

    });
    it('positive unicode', () => {
        createOrgModule.editOrgName2(orgId, data.org.nameUnicode)
    });
})
