import data from "../fixtures/data.json"
module.exports = {
    get revertArchive() {
        return cy.get("div[class='vs-c-my-organizations-item-wrapper vs-c-my-organizations-item-wrapper--archived']>div:last-child [title='Reopen Organization']")
    },
    get archiveOrg() {
        return cy.get("div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-of-type(3) span[title='Archive Organization']")
    },
    get denyArchive() {
        return cy.get("[name='cancel-btn']")
    },
    get confirmArchive() {
        return cy.get("[name='save-btn']")
    },
    checkIfOrgIsActive(id) {
        cy.get("div[class='vs-c-my-organizations-item-wrapper']>div[id=" + id + "]").should('exist')
    },
    checkIfOrgIsArchived(id) {
        cy.get("div[class='vs-c-my-organizations-item-wrapper vs-c-my-organizations-item-wrapper--archived']>div[id=" + id + "]").should('exist')
    },
    get deleteOrg() {
        return cy.get("div[class='vs-c-my-organizations-item-wrapper vs-c-my-organizations-item-wrapper--archived']>div:last-child [title='Delete Organization']")
    },
    get password() {
        return cy.get("input")
    },
    get errorPass() {
        return cy.get(".el-message__group > p")
    },
    checkOrgStatusAPI(status, token) {
        cy.request({
            headers: {
                'authorization': "Bearer " + token,
            },
            method: 'GET',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations`
        }).should((response) => {
            expect(response.body[response.body.length - 1].status).to.eq(status)
            expect(response.status).to.eq(200)
        })
    },
    deleteOrgWithPass({ id, pass = data.user.password }) {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/' + id).as('delete')
        this.deleteOrg.click({ force: true })
        this.password.type(pass)
        this.confirmArchive.click()

        if (pass == data.user.password) {
            cy.wait('@delete').its("response").then((res) => {
                expect(res.statusCode).to.eq(201);
                expect(res.body.id).to.eq(id);
            })
        } else {
            cy.wait('@delete').its("response").then((res) => {
                expect(res.statusCode).to.eq(403);
                this.errorPass.should('have.text', data.errors.pass)

            })
        }
    }

}