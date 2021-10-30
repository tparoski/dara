/// <reference types ="Cypress" />
import org from "../fixtures/addOrg.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import board from "../fixtures/addBoard.json"
import nav from "../fixtures/navigation.json"
describe('edit org', () => {
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
        cy.intercept('https://cypress-api.vivifyscrum-stage.com/api/v2/users/app-notifications').as('logged')
        cy.visit(url.myOrg)
        cy.wait('@logged')
        cy.get(org.activeOrg)
            .children()
            .then(($children) => {
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
        cy.get(org.archivedOrg)
            .children()
            .then(($children) => {
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
    })
    it('edit name to nothing', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear()
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard).should('have.text', data.org.name)
    });
    it('edit name only spaces', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.strings.onlyspaces)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard).should('have.text', data.org.name)
    });
    //bug. only BE error , no FE
    it('change name to over 255  char', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.strings.string256)
        cy.get(org.editOrganization.denyChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard).should('have.text', data.org.name)
    });
    it('give up on a change', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.strings.string5)
        cy.get(org.editOrganization.denyChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard).should('have.text', data.org.name)
    });
    it('positive', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.org.name2)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.wait(500)
        cy.get(org.organizationName.checkNameDashBoard).should('have.text', data.org.name2)
    });
    it('positive 255 char', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.org.name255)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard).should('include.text', "KYci3ymXPwPuSnQwK...")
    });
    it('positive unicode', () => {
        cy.get(org.editOrganization.editOrgName).click()
        cy.get(org.editOrganization.editOrgNameInput).clear().type(data.org.nameUnicode)
        cy.get(org.editOrganization.confirmChangeName).click()
        cy.get(org.organizationName.checkNameDashBoard).should('have.text', data.org.nameUnicode)
    });
})
