import color from "../support/cosoleColor"
import faker from "faker"
module.exports = {

    getAll({
        orgId = "",
        token = "",
        statusCode = 200,
        testMessage = ""
    }) {
        return cy.request({
            method: "GET",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/boards-data`,
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then(response => {
            typeof response.status !== "undefined" && response.status === statusCode
                ? color.log(`${testMessage} - Pass`, "success")
                : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
            console.log(response)
            expect(response.status).to.eql(statusCode)
            return response.body
        })
    },
    post({
        orgId = "",
        token = "",
        statusCode = 201,
        testMessage = "",
        boardName = faker.vehicle.type(),
        boardType = "",
        configureMembers = null,
        configureBoard = null
    }) {
        return cy.request({
            method: "POST",
            url: "https://cypress-api.vivifyscrum-stage.com/api/v2/boards",
            headers: {
                Authorization: "Bearer " + token,
            },
            body: {
                name: boardName,
                configuration_board_id: configureBoard,
                team_members_board_id: configureMembers,
                type: boardType,
                organization_id: orgId
            }
        }).then(response => {
            typeof response.status !== "undefined" && response.status === statusCode
                ? color.log(`${testMessage} - Pass`, "success")
                : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
            console.log(response)
            expect(response.status).to.eql(statusCode)
            return response.body
        })
    },
    put({
        token = "",
        statusCode = 200,
        testMessage = "",
        boardName = faker.vehicle.type(),
        boardId = "",
        boardDescription= null,
        boardCode ="",
        units="points"
    }) {
        return cy.request({
            method: "PUT",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`,
            headers: {
                Authorization: "Bearer " + token,
            },
            body: {
                name:boardName,
                description:boardDescription,
                code:boardCode,
                task_unit:units
            }
        }).then(response => {
            typeof response.status !== "undefined" && response.status === statusCode
                ? color.log(`${testMessage} - Pass`, "success")
                : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
            console.log(response)
            expect(response.status).to.eql(statusCode)
            return response.body
        })
    },
    delete({
        token = "",
        statusCode = 200,
        testMessage = "",
        boardId = ""
    }) {
        cy.request({
            method: "DELETE",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`,
            headers: {
                Authorization: "Bearer " + token,
            }
        })
            .then(response => {
                typeof response.status !== "undefined" && response.status === statusCode
                    ? color.log(`${testMessage} - Pass`, "success")
                    : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
                console.log(response)
                expect(response.status).to.eql(statusCode)
            })

    },
    archive({
        token = "",
        statusCode = 200,
        testMessage = "",
        boardId = "",
        boardstatus = "archived"
    }) {
        cy.request({
            method: "PUT",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}/status`,
            headers: {
                Authorization: "Bearer " + token,
            },
            body : {
                status:boardstatus
            }
        })
            .then(response => {
                typeof response.status !== "undefined" && response.status === statusCode
                    ? color.log(`${testMessage} - Pass`, "success")
                    : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
                console.log(response)
                expect(response.status).to.eql(statusCode)
            })

    }



}