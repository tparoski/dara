import data from "../fixtures/data.json"
import board from "./createBoardModule"
import nav from "./navModule"
import faker from "faker"
module.exports = {
    get newOrg() {
        return cy.get(".vs-c-my-organization__header--add-new>h2")
    },
    get organizationNameInput() {
        return cy.get("input[name='name']")
    },
    get nextBtnModal() {
        return cy.get("button[name='next_btn']")
    },
    get uploadLogo() {
        return cy.get("input[name='file']")
    },
    get modalTitle() {
        return cy.get("div[class='vs-c-modal vs-c-modal--starter vs-c-modal--create-organization'] h2 span")
    },
    get modalLogoTitle() {
        return cy.get(".vs-c-modal__header > h4")
    },
    get deleteLogo() {
        return cy.get(".vs-u-pull--left")
    },
    get cancelLogo() {
        return cy.get("[name='cancel-btn']")
    },
    get closeModal() {
        return cy.get("button[name='close-confirmation-modal-btn']")
    },
    get saveLogo() {
        return cy.get(".vs-u-text--right > .el-button--success")
    },
    get activeOrgParent() {
        return cy.get(".vs-c-my-organizations-item-wrapper")
    },
    get activeOrg() {
        return cy.get(".vs-c-my-organizations-item-wrapper").children("div[class='vs-c-my-organization organization-list-item']")
    },
    get errorImage() {
        return cy.get(".el-message__group > p")
    },
    get editOrgName() {
        return cy.get("div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-of-type(3) span[title='Edit Organization']")
    },
    get editNameInput() {
        return cy.get("input")
    },
    get confirmOrgName() {
        return cy.get("button[name='change-organization-name']")
    },
    get denyOrgName() {
        return cy.get("button[name='change-organization-name']~button")
    },
    get checkOrgNameDashboard() {
        return cy.get("div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-child(3) h2")
    },
    editOrgName2(id, newName) {
        cy.intercept('PUT', `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${id}`).as('orgNameEdit');
        this.editOrgName.click();
        this.editNameInput.should('be.visible').clear().type(newName);
        this.confirmOrgName.should('be.visible').click();
        cy.wait('@orgNameEdit').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.name).to.eq(newName);
        })
        this.checkOrgNameDashboard.invoke('text').should('contain', newName.substring(0, 16))
    },
    createOrgPositive({ file, name = faker.company.companyName() }) {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations').as('orgCreated');
        this.newOrg.click();
        this.modalTitle.should("be.visible").and('have.text', data.org.titleNewOrg);
        this.organizationNameInput.should('be.visible').type(name);
        this.nextBtnModal.should('not.be.disabled').click()
        this.modalTitle.should("be.visible").and('have.text', name);
        if (file) {
            this.uploadLogo.attachFile(file)
            this.modalLogoTitle.should('have.text', data.org.uploadLogoTitle)
            this.saveLogo.should('not.be.disabled').click()
        }
        this.nextBtnModal.should('not.be.disabled').click();
        if (file) {
            cy.wait('@orgCreated').its("response").then((res) => {
                expect(res.statusCode).to.eq(200);
                expect(res.body.name).to.eq(name);
                expect(res.body.original_avatar).to.not.eq(null);
            })
        } else {
            cy.wait('@orgCreated').its("response").then((res) => {
                expect(res.statusCode).to.eq(200);
                expect(res.body.name).to.eq(name);
                expect(res.body.original_avatar).to.eq(null);
            })
        }
        board.okBoard.click()
        nav.orgName.should('have.text', name)
    },
    logoNegative(action, file) {
        const name = faker.company.companyName()
        this.newOrg.click();
        this.modalTitle.should("be.visible").and('have.text', data.org.titleNewOrg);
        this.organizationNameInput.should('be.visible').type(name);
        this.nextBtnModal.should('not.be.disabled').click()
        this.modalTitle.should("be.visible").and('have.text', name);
        this.uploadLogo.attachFile(file)
        this.modalLogoTitle.should('have.text', data.org.uploadLogoTitle)
        if (action == "cancel") {
            this.cancelLogo.should("be.visible").click();
        } else if (action == "delete") {
            this.deleteLogo.should("be.visible").click();
        } else {
            this.closeModal.should("be.visible").click();
        }
        this.modalTitle.should('have.text', name)
    },
    wrongFileType({ file, name = faker.company.companyName() }) {
        console.log(file + " " + name)
        this.newOrg.click();
        this.modalTitle.should("be.visible").and('have.text', data.org.titleNewOrg);
        this.organizationNameInput.should('be.visible').type(name);
        if (file) {
            this.nextBtnModal.should('not.be.disabled').click()
            this.modalTitle.should("be.visible").and('have.text', name);
            this.uploadLogo.attachFile(file)
            this.errorImage.should('be.visible')
                .and('have.text', data.errors.logo)
        }
    },
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
                expect(res.body.id.toString()).to.eq(id);
            })
        } else {
            cy.wait('@delete').its("response").then((res) => {
                expect(res.statusCode).to.eq(403);
                this.errorPass.should('have.text', data.errors.pass)
            })
        }
    }
}
