module.exports = {
    get orgName(){
        return cy.get("span>strong")
    },
    get boradName(){
        return cy.get("h1 span")
    }
}
// {
//     "homeButton": ".vs-u-cursor--pointer .vs-c-site-sign",
//     "goToOrganization": ".vs-c-img--avatar.vs-u-cursor--pointer",
//     "markBoardFavourite": "div[class='vs-u-cursor--pointer vs-u-gap--right vs-u-display--flex']",
//     "search": "input[type='text']",
//     "showPreviouseSprints": "button[name='show_finished_sprints']",
//     "showTableView": "button[name='show_finished_sprints']+button",
//     "moreOptions": "button[name='show_finished_sprints'] ~ div",
//     "filter": "div[class='vs-c-dropdown-wrapper vs-c-filter'] button",

