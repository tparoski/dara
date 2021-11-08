module.exports = {
    get orgName(){
        return cy.get("span>strong")
    },
    get boradName(){
        return cy.get("h1 span")
    }
}
