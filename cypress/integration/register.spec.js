/// <reference types ="Cypress" />
const register = require("../fixtures/register.json")
const data = require("../fixtures/data.json")
const faker = require("faker");
describe('just register', () => {
    before(() => {
        cy.visit('https://cypress-api.vivifyscrum-stage.com/pricing', { timeout: 30000 })
        cy.get(register.monthlyPackages.tenMembers).eq(1).click({ force: true })
    })
    it('empty', () => {
        cy.get(register.registration.checkBox).uncheck({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
        cy.get(register.errors.password)
        cy.get(register.errors.noOfUsers)
        cy.get(register.errors.checkBox)
    });
    it('email without @', () => {
        cy.get(register.registration.email).clear().type("tparoskigmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email with two @', () => {
        cy.get(register.registration.email).clear().type("tpa@roski@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email with..', () => {
        cy.get(register.registration.email).clear().type("email@example..com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email without dot', () => {
        cy.get(register.registration.email).clear().type("tparoski@gmailcom")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email with >74 char', () => {
        cy.get(register.registration.email).clear().type("pplamjaagmabhagpcddfhchgpobbhmnligffffffffffffjhkibnghipkcpeilopg@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('pass minimum', () => {
        cy.get(register.registration.email).clear().type("tparoski1@gmail.com")
        cy.get(register.registration.password).clear().type("test")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.password)
    });
    it('no of users<1', () => {
        cy.get(register.registration.email).clear().type("tparoski2@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("0")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users>10', () => {
        cy.get(register.registration.email).clear().type("tparoski3@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("11")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users letters', () => {
        cy.get(register.registration.email).clear().type("tparoski4@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("test")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users with spaces', () => {
        cy.get(register.registration.email).clear().type("tparoski4@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("  2")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users with decimal values', () => {
        cy.get(register.registration.email).clear().type("tparoski4@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("3.5")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('exsisting email', () => {
        cy.get(register.registration.email).clear().type(data.user.email)
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.beckend)
    });
    it('without checkbox', () => {
        cy.get(register.registration.email).clear().type("tparoski5@gmail.com")
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).uncheck({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.checkBox)
    });
    it('positive one', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type("test1234")
        cy.get(register.registration.noOfUsers).clear().type("10")
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
    });
})
