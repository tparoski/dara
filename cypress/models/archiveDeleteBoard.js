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
    },
    createOrgApi(token) {
        return cy.request({
            headers: {
                'authorization': "Bearer " + token,
            },
            method: 'POST',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations`,
            body: {
                name: faker.animal.cat()
            }
        }).should((response) => {
            expect(response.status).to.eq(200)
        }).then(response => {
            return response.body.id
        })
    },
    createBoardApi(token, orgID) {
        return cy.request({
            headers: {
                'authorization': "Bearer " + token,
            },
            method: 'POST',
            url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards',
            body: {
                name: faker.animal.dog(),
                type: "scrum_board",
                configuration_board_id: null,
                team_members_board_id: null,
                organization_id: orgID
            }
        }).should((response) => {
            expect(response.status).to.eq(201)
        }).then(response => {
            return response.body.id
        })
    },
    archiveBoardAPI(token, boardId) {
        cy.request({
            headers: {
                'authorization': "Bearer " + token,
            },
            method: 'PUT',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`,
            body: {
                status: "archived"
            }
        }).should((response) => {
            expect(response.status).to.eq(200)
        })
    }

}
