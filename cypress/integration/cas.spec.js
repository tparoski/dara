import userApi from "../api/user"
import orgApi from "../api/organizatio"
describe('happy', () => {
    let userToken
    let organizationId
    before(() => {
        userApi.login({ testMessage: "Login before tests" }).then((token) => {
            userToken = token
        })
    })
    after(() => {
        orgApi.get({
            token: userToken,
        }).then((allOrg) => {
            allOrg.forEach(organization => {
                orgApi.delete({
                    token: userToken,
                    testMessage: "Survival",
                    orgId: organization.id
                })
            });
        })
    })
    it('wrong email', () => {
        orgApi.post({
            token: userToken,
            testMessage: "Survival"
        }).then((organizationObject) => {
            organizationId = organizationObject.id
        })
    })

    it('update name', () => {
        orgApi.update
            ({
                token: userToken,
                orgId: organizationId
            })
    })
    it('delete', () => {
        orgApi.delete({
            token: userToken,
            testMessage: "Survival",
            orgId: organizationId
        })
    })
    it('getAllOrg', () => {
        orgApi.get({
            token: userToken,
        }).then((allOrg) => {
            allOrganization = allOrg
        })
    })
});
