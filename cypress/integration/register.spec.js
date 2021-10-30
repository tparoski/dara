/// <reference types ="Cypress" />
import register from "../fixtures/register.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import sideBar from "../fixtures/sideBar.json"
const faker = require("faker");
describe('register', () => {
    beforeEach(() => {
        cy.visit(url.register)
        cy.get(register.titlePricingPlans).should('have.text', data.titles.pricingPage)
        cy.get(register.monthlyPackages.tenMembers).eq(1).click({force:true})
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/register').as('register')
    })
    after('log out', ()=>{
        cy.intercept('POST','/api/v2/logout').as('loggedOut')
        cy.get(sideBar.logout.logo).click()
        cy.get(sideBar.logout.me).click()
        cy.get(sideBar.logout.logout).click()
        cy.wait('@loggedOut').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
        })
        cy.url().should('eq',`${Cypress.config('baseUrl')}/login`)
    })
    it('empty', () => {
        cy.get(register.registration.checkBox).uncheck({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.contain(data.errors.register.termsRequired)
        })
    });
    it('email without @', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.emailNoAt)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('email with two @', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.email2Ats)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('email with..', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.email2Dots)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('email without dot', () => {
        cy.get(register.registration.email).clear().type(data.userInvalid.emailNoAt)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('email with >74 char', () => {
        cy.get(register.registration.email).clear().type(data.strings.email75char)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('pass minimum', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.shortPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.contain(data.errors.register.passMin)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('no of users<1', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.zero)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
            expect($child[2].innerText).to.contain(data.errors.register.usersMinMax)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('no of users>10', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.eleven)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
            expect($child[2].innerText).to.contain(data.errors.register.usersMinMax)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('no of users letters', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.inLetters)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
            expect($child[2].innerText).to.contain(data.errors.register.usersInteger)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    // //Under normal circumstances, I would report this as a bug since I would expect spaces to be trimmed and this would be  positive case
    it('no of users with spaces', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.spaceNum)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
            expect($child[2].innerText).to.contain(data.errors.register.usersInteger)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('no of users with decimal values', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.decimal)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
            expect($child[2].innerText).to.contain(data.errors.register.usersInteger)
            expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
        })
    });
    it('exsisting email', () => {
        cy.get(register.registration.email).clear().type(data.user.email)
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.wait('@register').its("response").then((res) => {
            expect(res.statusCode).to.eq(401);
        })
        cy.get(register.errors.beckend).should('be.visible').and('have.text', data.errors.register.userExsists)
    });
    it('without checkbox', () => {
        cy.get(register.registration.email).clear().type(faker.internet.email())
        cy.get(register.registration.password).clear().type(data.userInvalid.wrongPass)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).uncheck({ force: true })
        cy.get(register.registration.submit).click()
        cy.get(register.errors.all).children()
        .should('have.length', 4).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
            expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
            expect($child[3].innerText).to.contain(data.errors.register.termsRequired)
        })
    });
    it('positive one', () => {
        const email=faker.internet.email().toLowerCase()
        cy.intercept('/api/v2/users/app-notifications').as('register')
        cy.get(register.registration.email).clear().type(email)
        cy.get(register.registration.password).clear().type(data.user.password)
        cy.get(register.registration.noOfUsers).clear().type(data.userNumbers.ten)
        cy.get(register.registration.checkBox).check({ force: true })
        cy.get(register.registration.submit).click()
        cy.wait('@register').its("response").then((res) => {
            expect(res.statusCode).to.eq(200);
            expect(res.body.user.email).to.eq(email);
            expect(res.body.user.premium_plan_members.toString()).to.eq(data.userNumbers.ten);
        })
        cy.url().should('eq',`${Cypress.config('baseUrl')}/my-organizations`)
    });
});

