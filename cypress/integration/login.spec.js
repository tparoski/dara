/// <reference types ="Cypress" />
import login from "../fixtures/login.json"
import sideBar from "../fixtures/sideBar.json"
import data from "../fixtures/data.json"
import url from "../fixtures/url.json"
describe('prvi testovi', () => {
    beforeEach(() => {
        cy.visit(url.login)
    });
    after('log out', ()=>{
        cy.intercept('POST','/api/v2/logout').as('loggedOut')
        cy.get(sideBar.logout.logo).click()
        cy.get(sideBar.logout.me).click()
        cy.get(sideBar.logout.logout).click()
        cy.wait('@loggedOut').its("response").then((res) => {
            expect(res.statusCode).to.eq(201);
        })
    })
    it('missing email', () => {
        cy.get(login.form.emailLogin).clear()
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.all).should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
        })
    });
    it('missing password', () => {
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear()
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.all).should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.not.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.contain(data.errors.register.passReqired)
        })
    });
    it('wrong pass', () => {
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.userInvalid.wrongPass)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.wrongCredentials).should('have.text',data.errors.register.invalidCredentials)
    });
    it('wrong email', () => {
        cy.get(login.form.emailLogin).clear().type(data.userInvalid.wrongEmail)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.wrongCredentials).should('have.text',data.errors.register.invalidCredentials)
    });
    it('email without @', () => {
        cy.get(login.form.emailLogin).clear().type(data.userInvalid.emailNoAt)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.all).should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
        })
    });
    it('email without dot', () => {
        cy.get(login.form.emailLogin).clear().type(data.userInvalid.emailNoDot)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.all).should('have.length', 2).then(($child) => {
            expect($child[0].innerText).to.contain(data.errors.register.validEmail)
            expect($child[1].innerText).to.not.contain(data.errors.register.passReqired)
        })
    });
    it('trim spaces', () => {
        cy.get(login.form.emailLogin).clear().type("   " + data.user.email)
        cy.get(login.form.passwordLogin).clear().type("   " + data.user.password)
        cy.get(login.form.loginButton).click()
        cy.get(login.erros.wrongCredentials).should('have.text',data.errors.register.invalidCredentials)
    });
    it('login', () => {
        cy.intercept('POST', 'https://cypress-api.vivifyscrum-stage.com/api/v2/login').as("login")
        cy.get(login.form.emailLogin).clear().type(data.user.email)
        cy.get(login.form.passwordLogin).clear().type(data.user.password)
        cy.get(login.form.loginButton).click()
        cy.wait('@login').its("response").then((res) => {
            expect(res.body.user.id).to.eq(666)
            expect(res.statusCode).to.eq(200);
        })
        cy.url().should('eq',`${Cypress.config('baseUrl')}/my-organizations`)
    });
})
