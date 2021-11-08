/// <reference types ="Cypress" />
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
import loginModule from "../models/loginModule"
describe('prvi testovi', () => {
    beforeEach(() => {
        cy.visit(url.login)
    });
    after('log out', () => {
        cy.logOut()
    })
    it('missing email', () => {
        loginModule.login({email: ""})
        loginModule.allErrors.should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
        })
    });
    it('missing password', () => {
        loginModule.login({email:data.user.email,password: ""})
        loginModule.allErrors.should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.contain(data.errors.register.passReqired)
        })
    });
    it('wrong pass', () => {
        loginModule.login({password:data.userInvalid.wrongPass})
        loginModule.wrongCredentials.should('have.text', data.errors.register.invalidCredentials)
    });
    it('wrong email', () => {
        loginModule.login({email:data.userInvalid.wrongEmail})
        loginModule.wrongCredentials.should('have.text', data.errors.register.invalidCredentials)
    });
    it('email without @', () => {
        loginModule.login({email:data.userInvalid.emailNoAt})
        loginModule.allErrors.should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
        })
    });
    it('email without dot2', () => {
        loginModule.login({email:data.userInvalid.emailNoDot})
        loginModule.allErrors.should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
        })
    });
    it('trim spaces', () => {
        loginModule.login({email:"   " + data.user.email,password:"   " + data.user.password})
        loginModule.wrongCredentials.should('have.text', data.errors.register.invalidCredentials)
    });
    it('login', () => {
        loginModule.login({})
    });
})
