
import faker from "faker"
import color from "../support/cosoleColor"

module.exports = {
    post({
        orgName = faker.animal.crocodilia(),
        token = "",
        statusCode =200,
        testMessage = ""
    }) {
        return cy.request({
            failOnStatusCode: false,
            method: 'POST',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations`,
            body: {
                name: orgName
            },
            headers: {
                Authorization: "Bearer " + token,
            },
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
        orgId = "",
        token = "",
        statusCode =201,
        testMessage = "",
        password = "majakowski0506"
    }) {
         cy.request({
            failOnStatusCode: false,
            method: 'POST',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
            body: {
                passwordOrEmail: password
            },
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then(response => {
            response.status === statusCode
            ? color.log(`${testMessage} - Pass`, "success")
            : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
            console.log(response)
            expect(response.status).to.eql(statusCode)
        })
    },

    get({token=""}){
        return cy.request({
            method: "GET",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations-data`,
            headers: {
                Authorization: "Bearer " + token,
            }
        }).then((response) => {
            expect(response.status).to.eql(200)
            return response.body
        })
    },
    update({
        token="",
        orgId = "",
        orgName= faker.animal.cat(),
        statusCode= 200,
        testMessage = "",
    }) {
        cy.request({
            failOnStatusCode: false,
            method: 'PUT',
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
            body: {
                name: orgName
            },
            headers: {
                Authorization: "Bearer " + token,
            },
        }).then(response => {
            typeof response.status !== "undefined" && response.status === statusCode
            ? color.log(`${testMessage} - Pass`, "success")
            : color.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
            console.log(response)
            expect(response.status).to.eql(statusCode)
        })

        }


}