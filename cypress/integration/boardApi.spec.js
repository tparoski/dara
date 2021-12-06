import userApi from "../api/user"
import boardApi from "../api/board"
import orgApi from "../api/organizatio"
describe('Testing', () => {
    let userToken
    let organizationId
    let allBoards
    let boardId
    let code
    before(() => {
        userApi.login({ testMessage: "Login before tests" }).then((token) => {
            userToken = token
        }).then((userToken) => {
            orgApi.post({
                token: userToken,
                testMessage: "Survival"
            }).then((organizationObject) => {
                organizationId = organizationObject.id

            })
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
                            orgId :organization.id
                        })
            });
        })
    })
    it('get all', () => {
        boardApi.getAll({ orgId: organizationId, token: userToken }).then((boards) => {
            allBoards = boards
        })
    });
    it('create', () => {
        boardApi.post({ orgId: organizationId, token: userToken, boardType: "scrum_board" }).then((board) => {
            boardId = board.id
            code=board.code
        })
    });
    it('get all', () => {
        boardApi.getAll({ orgId: organizationId, token: userToken }).then((newBoard) => {
            expect(newBoard.length).to.eql(allBoards.length+1)
        })
    });
    it('put', () => {
        boardApi.put({token:userToken, boardId:boardId, boardCode:code})
    });
    it('archive', () => {
        boardApi.archive({token:userToken, boardId:boardId})
    });
    it('delete', () => {
        boardApi.delete({token:userToken, boardId:boardId})
    });
});
