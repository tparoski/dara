module.exports={
    get collapseSidebar(){
        return cy.get("p[class='vs-c-sidebar-info']")
    },
    get addNewSomething(){
        return cy.get(".vb-content > div.vs-c-list > .vs-c-list__item > .vs-c-list__btn")
    },
    get addOrganization(){
        return cy.get(".vs-c-list > :nth-child(1) > a")
    },
    get addBoard(){
        return cy.get(":nth-child(2) > a")
    },
    get importBoard(){
        return cy.get(".vs-c-list > :nth-child(3) > a")
    },
    get logo(){
        return cy.get(".vs-u-img--round")
    },
    get me(){
        return cy.get("a[href='/account/settings']")
    },
    get logout(){
        return cy.get("button[class='vs-c-btn vs-c-btn--link vs-c-btn--danger']")
    },
    get addToNewOrg(){
        return cy.get("li[class='vs-c-list__item has-caret']:last-of-type li")
    },
    get addBoardToNewOrg(){
        return cy.get("li > a")
    },
    get collapseNewOrg(){
        return cy.get("li[class='vs-c-list__item has-caret']:last-of-type button")
    }

}