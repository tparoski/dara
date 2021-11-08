import faker from "faker"
module.exports = {
    get goToBoard() {
        return cy.get("div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-child(3)")
    },
    get archive() {
        return cy.get("div[class='vs-c-organization__section']>div:nth-last-child(2) >.vs-c-boards-item__header div[class='vs-c-boards-item__actions vs-u-display--flex']>div>svg")
    },
    get confirmArchive() {
        return cy.get("[name='save-btn']")
    },
    get denyArchive() {
        return cy.get("[name='cancel-btn']")
    },
    get revertArchive() {
        return cy.get("div[class='vs-c-boards-item__actions vs-u-display--flex']>div:nth-child(2)")
    },
    get deleteBoard() {
        return cy.get("div[class='vs-c-boards-item__actions vs-u-display--flex']>div:nth-child(1)")
    },
    get activeParent() {
        return cy.get("div[class='vs-c-organization__body']",)
    },
    get archivedParent() {
        return cy.get("div[class='vs-c-organization__body']>div:last-child")
    }
}
