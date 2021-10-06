/// <reference types ="Cypress" />


const login = require("../fixtures/login.json")
const addOrg =require("../fixtures/addOrg.json")
const register  =require("../fixtures/register.json")
const sideBar=require("../fixtures/sideBar.json")
const addBoard=require("../fixtures/addBoard.json")

describe('login case',() =>{
 
    

    it('justTest',() =>{
        // cy.visit('https://www.vivifyscrum.com/pricing#')
        // cy.get(register.other.cookies).click()
        // cy.get(register.other.swithchToMonthly).click({force:true})
        // cy.get(register.other.enterprise).click({force:true})
        cy.visit('')
        cy.get(login.form.emailLogin).type('tamara.p@vivifyideas.com')
        cy.get(login.form.passwordLogin).type('majakowski0506')
        cy.get(login.form.loginButton).click()
        cy.wait(5000)
        cy.get(sideBar.newOrg.addToNewOrg).eq(1).click()
        cy.get(sideBar.newOrg.addBoardToNewOrg).click()
        cy.wait(5000)
        cy.get(addBoard.newBoard.organization).click({force:true})
        cy.get(addBoard.newBoard.title).type("nesto")
        cy.get(addBoard.navigation.nextButton).click()
        cy.get(addBoard.boardType.kanban).click()
        cy.get(addBoard.navigation.nextButton).click()
        cy.get(addBoard.import.configuration).click()
        cy.get(addBoard.import.configuration).click()
        cy.get(addBoard.import.members).click()
        cy.get(addBoard.import.members).click()
        cy.get(addBoard.navigation.nextButton).click()
        const filepath = '../integration/147206.jpg'
        cy.get(addBoard.logo.uploadlogo).attachFile(filepath);
        cy.get(addBoard.logo.saveLogo).click()
        cy.get(addBoard.navigation.nextButton).click()
        cy.get(addBoard.navigation.nextButton).click()
        // cy.wait(5000)
        // cy.get(addOrg.navigation.addNewOrganization).click()
        // cy.get(addOrg.organizationName.organizationNameInput).type('anything')
        // cy.get(addOrg.navigation.nextButton).click()
        // const filepath = '../integration/147206.jpg'
        // cy.get(addOrg.logo.uploadlogo).attachFile(filepath);
        // cy.get(addOrg.logo.saveLogo).click()
        // cy.visit('')
        // cy.get(addOrg.navigation.newlyCreatedOrganization).click()
    })
})