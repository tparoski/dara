/// <reference types ="Cypress" />
import register from "../fixtures/register.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
const faker = require("faker");
describe('register', () => {
    beforeEach(() => {
        cy.visit(url.login, { timeout: 30000 })
        cy.visit(url.register, { timeout: 30000 })
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
        cy.get(register.registration.email).clear().type(data.userInvalid.emailNoAt)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email with two @', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.email2Ats)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email with..', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.email2Dots)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email without dot', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.emailNoAt)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('email with >74 char', () => {
        cy.get(register.registration.email).clear().type(data.strings.email75char)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.email)
    });
    it('pass minimum', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.shortPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.password)
    });
    it('no of users<1', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.zero)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users>10', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.eleven)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users letters', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.inLetters)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users with spaces', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.spaceNum)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('no of users with decimal values', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.decimal)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.noOfUsers)
    });
    it('exsisting email', () => {
        cy.get(register.registration.email).clear().type(data.user.email)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.beckend)
    });
    it('without checkbox', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).uncheck({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.checkBox)
    });
    it('positive one', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.user.password)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
    });
})
