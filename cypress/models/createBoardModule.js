import data from "../fixtures/data.json"
import faker from "faker"
module.exports={
get okBoard(){
    return cy.get(".vs-c-modal--features-button > .vs-c-btn")
},
get addFromDashboard(){
    return cy.get("div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-of-type(3) li[title='Add new Board']")
},
get addFromOrg(){
    return cy.get("p>strong")
},
get addFromSideSomething(){
    return cy.get(".vb-content > div.vs-c-list > .vs-c-list__item > .vs-c-list__btn")
},
get addFromSideOrg(){
    return cy.get(".vs-c-list > :nth-child(1) > a")
},
get addFromSideBoard(){
    return cy.get(".vs-c-list > :nth-child(2) > a")
},
get addToNewOrgSth(){
    return cy.get("li[class='vs-c-list__item has-caret']:last-of-type li")
},
get addToNewOrgBoard(){
    return cy.get("li > a")
},
get modalOrgInput(){
    return cy.get("input[class='el-input__inner']")
},
get modalOrgSelect(){
    return cy.get(".el-select-dropdown__item > span")
},
get modalBoardTitle(){
    return cy.get("input[name='name']")
},
get modalScrum(){
    return cy.get("span[name='type_scrum']")
},
get modalKanban(){
    return cy.get("span[name='type_kanban']")
},
get modalConfiguration(){
    return cy.get(":nth-child(1) > .vs-input-border > .el-select > .el-input > .el-input__inner")
},
get modalConfigInput(){
    return cy.get("input[class='el-input__inner']",)
},
get modalMembers(){
    return cy.get(":nth-child(2) > .vs-input-border > .el-select > .el-input > .el-input__inner")
},
get modalUploadLogo(){
    return cy.get("input[name='file']")
},
get modalCloseLogo(){
    return cy.get("button[name='close-confirmation-modal-btn']")
},
get modalDeleteLogo(){
    return cy.get(".vs-u-pull--left")
},
get modalCancelLogo(){
    return cy.get("[name='cancel-btn']")
},
get modalSaveLogo(){
    return cy.get(".vs-u-text--right > .el-button--success")
},
get modalHeader(){
    return cy.get(".vs-c-modal__header > h4")
},
get previouseBtn(){
    return cy.get("button[name='prev_btn']")
},
get nextBtn(){
    return cy.get("button[name='next_btn']")
},
get closeModal(){
    return cy.get("button[name='close-new-board-modal-btn']")
},
get errorImage(){
    return cy.get(".el-message__group > p")
},
get modalTitle(){
    return cy.get(".vs-c-modal__title")
},
invalidImageBoard({name= faker.internet.domainName(),file, boards}){
    this.addFromDashboard.click();
    this.modalTitle.should('contain', data.board.modalTitle)
    this.modalBoardTitle.type(name)
    this.nextBtn.should("be.visible").click()
    this.modalTitle.should('contain', data.board.modalTitle2)
    this.modalScrum.click()
    console.log(boards)
    if(boards>0){
        this.nextBtn.should("be.visible").click()
    }
    this.nextBtn.should("be.visible").click()
    this.modalTitle.should('contain', data.board.modalTitle3)
    this.modalUploadLogo.attachFile(file)
    this.errorImage.should('be.visible').and('have.text',data.errors.logo)
},
countBoards(token){
    let count
    cy.request({
        headers: {
            'authorization': "Bearer " + token,
        },
        method: 'GET',
        url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/boards/'
    }).then((response) => {
        count= response.body.length
    })
    return count
}

}

//     "visitNewBoardFromSideBar": "li[class='vs-c-list__item has-caret']:last-of-type li:nth-last-child(2)",
//     "okBoardCreated": ".vs-c-modal--features-button > .vs-c-btn",
//     "edit": {
//         "goToBoard": "div[class='vs-c-my-organizations-item-wrapper']>div:nth-last-child(3)",
//         "archive": "div[class='vs-c-organization__section']>div:nth-last-child(2) >.vs-c-boards-item__header div[class='vs-c-boards-item__actions vs-u-display--flex']>div>svg",
//         "confirmArchive": "[name='save-btn']",
//         "denyArchive": "[name='cancel-btn']",
//         "revertArchive": "div[class='vs-c-boards-item__actions vs-u-display--flex']>div:nth-child(2)",
//         "deleteBoard": "div[class='vs-c-boards-item__actions vs-u-display--flex']>div:nth-child(1)"
//     },
//     "modaltitle":"h2[class='vs-c-modal__title']",
//     "activeParent":"div[class='vs-c-organization__body']",
//     "archivedParent":"div[class='vs-c-organization__body']>div:last-child"
// }