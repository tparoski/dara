/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import registerModule from "../models/registerModule"
const faker = require("faker");
describe('register negative cases', () => {
    beforeEach(() => {
        cy.visit('https://cypress.vivifyscrum-stage.com/sign-up?type=yearly&plan=1&event=page-card')
    })
    it('empty', () => {
        registerModule.registerInValid({ email: "" })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.contain(data.errors.register.termsRequired)
            })
    });
    it('email without @', () => {
        registerModule.registerInValid({ email: data.userInvalid.emailNoAt })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('email with two @', () => {
        registerModule.registerInValid({ email: data.userInvalid.email2Ats })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('email with..', () => {
        registerModule.registerInValid({ email: data.userInvalid.email2Dots })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('email without dot', () => {
        registerModule.registerInValid({ email: data.userInvalid.emailNoAt })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('email with >74 char', () => {
        registerModule.registerInValid({ email: data.strings.email75char })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('pass minimum', () => {
        registerModule.registerInValid({ password: data.userInvalid.shortPass })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.contain(data.errors.register.passMin)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('no of users<1', () => {
        registerModule.registerInValid({ noOfUsers: data.userNumbers.zero })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
                expect($child[2].innerText).to.contain(data.errors.register.usersMinMax)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('no of users>10', () => {
        registerModule.registerInValid({ noOfUsers: data.userNumbers.eleven })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
                expect($child[2].innerText).to.contain(data.errors.register.usersMinMax)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('no of users letters', () => {
        registerModule.registerInValid({ noOfUsers: data.userNumbers.inLetters })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
                expect($child[2].innerText).to.contain(data.errors.register.usersInteger)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('no of users with spaces', () => {
        registerModule.registerInValid({ noOfUsers: data.userNumbers.spaceNum })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
                expect($child[2].innerText).to.contain(data.errors.register.usersInteger)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('no of users with decimal values', () => {
        registerModule.registerInValid({ noOfUsers: data.userNumbers.decimal })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passMin)
                expect($child[2].innerText).to.contain(data.errors.register.usersInteger)
                expect($child[3].innerText).to.not.contain(data.errors.register.termsRequired)
            })
    });
    it('exsisting email', () => {
        //u ovom specu sam dva puta interseptovala isti poziv ka register ruti. jednom ovde drugi put u registerModule.registerValid. Da li ej mozda pametnije da izvucem ovaj intercept na jedno mesto?
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/register').as('register')
        registerModule.registerInValid({ email: data.user.email })
        cy.wait('@register').its("response").then((res) => {
            expect(res.statusCode).to.eq(401);
        })
        registerModule.beError.should('be.visible').and('have.text', data.errors.register.userExsists)
    });
    it('without checkbox', () => {
        registerModule.registerInValid({ checkBox: false })
        registerModule.allErrors.children()
            .should('have.length', 4).then(($child) => {
                expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
                expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
                expect($child[2].innerText).to.not.contain(data.errors.register.usersRequired)
                expect($child[3].innerText).to.contain(data.errors.register.termsRequired)
            })
    }); 
});
describe('register positive cases', () => {
    beforeEach(() => {
        cy.visit('https://cypress.vivifyscrum-stage.com/sign-up?type=yearly&plan=1&event=page-card')
    })
    after('log out', () => {
        cy.logOut()
    })
    it("positive with eye closed", () => {
        registerModule.registerValid({})
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    });
    it("positive with eye open", () => {
        registerModule.registerValid({ eye: true })
        cy.url().should('eq', `${Cypress.config('baseUrl')}/my-organizations`)
    });
});
